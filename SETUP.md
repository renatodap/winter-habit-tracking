# 🚀 Quick Setup Guide

Get your Winter Arc Habit Tracker running in 5 minutes!

## Prerequisites Check

Before you start, make sure you have:

- [ ] Node.js 18 or higher installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (`git --version`)

## Setup Steps

### 1️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Tailwind CSS, and the Turso client.

### 2️⃣ Set Up Turso Database

#### Install Turso CLI

**macOS/Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Windows (WSL):**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Create Database

```bash
# Login to Turso
turso auth login

# Create your database
turso db create winter-arc

# Get the database URL (save this!)
turso db show winter-arc

# Create an auth token (save this too!)
turso db tokens create winter-arc
```

### 3️⃣ Configure Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Turso credentials:

```env
TURSO_DATABASE_URL=libsql://winter-arc-[your-username].turso.io
TURSO_AUTH_TOKEN=eyJhbGc...your-token-here
```

### 4️⃣ Initialize Database

Run the setup script to create tables and insert default habits:

```bash
npm run db:setup
```

You should see:
```
✅ Database setup complete!
Habits in database: 11
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

## Verification Checklist

After starting the dev server, verify:

- [ ] Page loads without errors
- [ ] 11 default habits are displayed
- [ ] Can check/uncheck habits
- [ ] Can click on numeric logs and enter values
- [ ] Momentum banner appears at top
- [ ] No console errors

## Next Steps

### Enable Notifications

1. Click the settings icon (gear) in the top right
2. Click "Enable Notifications"
3. Allow notifications when prompted
4. Click "Send Test Notification" to verify it works

### Install as PWA

**On Mobile (iOS/Android):**
1. Open the app in your browser
2. Follow the browser's "Add to Home Screen" prompt
3. Open the app from your home screen

**On Desktop (Chrome/Edge):**
1. Look for the install icon in the address bar
2. Click "Install"
3. The app will open in its own window

### Generate Icons

The app works without custom icons, but you can add them:

```bash
# Option 1: Use an online generator
# Visit: https://realfavicongenerator.net/
# Upload a 512x512 image and download the icons

# Option 2: Use ImageMagick (if installed)
convert -size 512x512 -background "#0ea5e9" -fill white \
  -gravity center -pointsize 300 -font Arial-Bold \
  label:"❄" public/icon-512.png

# Then resize for other sizes (72, 96, 128, 144, 152, 192, 384)
```

## Troubleshooting

### "TURSO_DATABASE_URL is not set" Error

- Check that `.env` file exists in project root
- Verify variable names are correct (no typos)
- Make sure there are no quotes around values
- Restart dev server after editing `.env`

### Database Connection Failed

```bash
# Test your database connection
turso db shell winter-arc "SELECT 1"

# If this fails, regenerate your token
turso db tokens create winter-arc

# Update .env with new token and restart
```

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
kill -9 $(lsof -ti:3000)

# Or use a different port
PORT=3001 npm run dev
```

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

## Getting Help

- **Turso Issues**: Check [Turso Docs](https://docs.turso.tech)
- **Next.js Issues**: Check [Next.js Docs](https://nextjs.org/docs)
- **General Issues**: Check the README.md troubleshooting section

## What's Next?

- Customize your habits in `src/db/schema.sql`
- Adjust reminder times in the database
- Modify colors in `tailwind.config.js`
- Deploy to Vercel (see DEPLOYMENT.md)

---

**Ready to start your Winter Arc journey!** 💪❄️
