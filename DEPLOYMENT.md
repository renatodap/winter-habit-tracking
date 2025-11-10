# 🚀 Deployment Guide

Complete guide for deploying your Winter Arc Habit Tracker to Vercel.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier works perfectly)
- Turso account (free tier works perfectly)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure all files are committed:

```bash
git add .
git commit -m "Initial commit: Winter Arc Habit Tracker"
git push origin main
```

### 2. Set Up Turso Database

If you haven't already:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login

# Create production database
turso db create winter-arc-prod

# Get database URL and save it
turso db show winter-arc-prod

# Create auth token and save it
turso db tokens create winter-arc-prod
```

### 3. Initialize Production Database

```bash
# Set environment variables temporarily
export TURSO_DATABASE_URL="your-production-url"
export TURSO_AUTH_TOKEN="your-production-token"

# Run setup script
npm run db:setup
```

### 4. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add `TURSO_DATABASE_URL` with your production URL
   - Add `TURSO_AUTH_TOKEN` with your production token
   - Select all environments (Production, Preview, Development)

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then add environment variables:
vercel env add TURSO_DATABASE_URL
# Paste your database URL

vercel env add TURSO_AUTH_TOKEN
# Paste your auth token

# Deploy to production
vercel --prod
```

### 5. Verify Deployment

1. Visit your deployment URL
2. Check that habits load correctly
3. Test logging a habit
4. Test numeric inputs
5. Request notification permission
6. Test PWA installation

### 6. Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (usually < 5 minutes)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `TURSO_DATABASE_URL` | Your Turso database URL | `libsql://winter-arc-prod-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | Authentication token for Turso | `eyJhbG...` |

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All habits are displayed
- [ ] Can check/uncheck habits
- [ ] Can input numeric values
- [ ] Momentum banner shows correct data
- [ ] Weekly summary displays
- [ ] Notifications can be enabled
- [ ] PWA can be installed on mobile
- [ ] Offline mode works
- [ ] Custom domain configured (if applicable)

## Troubleshooting

### Build Failures

**Error: "Cannot find module '@/components/...'"**
- Ensure `tsconfig.json` has correct paths configuration
- Check that all imports use `@/` prefix consistently

**Error: "TURSO_DATABASE_URL is not set"**
- Add environment variables in Vercel dashboard
- Ensure they're enabled for Production environment
- Redeploy after adding variables

### Runtime Errors

**Error: "Failed to fetch habits"**
- Check Turso database is accessible
- Verify auth token is valid: `turso db tokens validate <token>`
- Check API routes are deployed: Visit `/api/habits` directly

**Database empty after deployment**
- Run setup script with production credentials
- Or manually insert habits via Turso CLI:
  ```bash
  turso db shell winter-arc-prod < src/db/schema.sql
  ```

### PWA Issues

**Service worker not registering**
- Ensure deployment is HTTPS (Vercel uses HTTPS by default)
- Check `next.config.js` headers configuration
- Clear cache and hard reload

**Icons not showing**
- Generate icons and commit them to repository
- Ensure paths in `manifest.json` are correct
- Check `/manifest.json` is accessible

## Updating Your Deployment

### Automatic Deployment (Recommended)

Vercel automatically deploys when you push to your repository:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically build and deploy
```

### Manual Deployment

```bash
vercel --prod
```

## Database Migrations

When you update the schema:

1. **Modify schema**: Edit `src/db/schema.sql`
2. **Test locally**: Run `npm run db:setup` with local database
3. **Backup production**:
   ```bash
   turso db shell winter-arc-prod ".dump" > backup.sql
   ```
4. **Apply to production**:
   ```bash
   turso db shell winter-arc-prod < src/db/schema.sql
   ```
5. **Deploy code**: Push to Git or run `vercel --prod`

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Analytics tab for:
- Page views
- Performance metrics
- User locations

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay

Add to `pages/_app.tsx`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

## Scaling Considerations

For the single-user version, Vercel's free tier is sufficient. If expanding:

- **Multi-user**: Add authentication (NextAuth.js)
- **More data**: Upgrade Turso plan
- **High traffic**: Vercel Pro plan
- **Real-time sync**: Add WebSockets or Pusher

## Backup Strategy

### Automated Backups

Create a GitHub Action (`.github/workflows/backup.yml`):

```yaml
name: Database Backup
on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Turso CLI
        run: curl -sSfL https://get.tur.so/install.sh | bash
      - name: Backup Database
        run: |
          turso db shell winter-arc-prod ".dump" > backup-$(date +%Y%m%d).sql
        env:
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
      - name: Upload Backup
        uses: actions/upload-artifact@v3
        with:
          name: database-backup
          path: backup-*.sql
```

### Manual Backup

```bash
turso db shell winter-arc-prod ".dump" > backup.sql
```

## Security Best Practices

1. **Never commit `.env` files**
   - Use `.env.example` for documentation
   - Add `.env` to `.gitignore`

2. **Rotate tokens periodically**
   ```bash
   turso db tokens create winter-arc-prod
   # Update in Vercel dashboard
   ```

3. **Enable Vercel authentication** (optional)
   - Dashboard → Settings → Authentication
   - Add password protection

4. **Use HTTPS only**
   - Enforced by Vercel automatically
   - Configure CSP headers if needed

## Cost Estimates

### Free Tier (Perfect for single user)

- **Vercel**: Free forever
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic SSL

- **Turso**: Free tier includes
  - 9 GB storage
  - 500M row reads/month
  - 25M row writes/month

**Total monthly cost: $0** 🎉

### If Scaling Up

Vercel Pro: $20/month
Turso Scaler: $29/month
Total: ~$50/month for serious usage

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Turso Documentation](https://docs.turso.tech)
3. Review deployment logs in Vercel dashboard
4. Open an issue in your repository

---

**Happy deploying!** 🚀
