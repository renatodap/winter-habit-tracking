# ❄️ Winter Arc Habit Tracker

A beautiful, minimal Progressive Web App (PWA) for tracking daily habits, nutrition, and fitness goals during your Winter Arc protocol. Built for single-user use with offline-first capabilities.

![Winter Arc Banner](https://img.shields.io/badge/Winter_Arc-Protocol-0ea5e9?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎯 Core Functionality
- **Daily Habit Checklist**: Pre-configured habits with one-tap completion
- **Numeric Logging**: Instant input for weight, calories, protein, training, and sleep
- **Momentum Statement**: Real-time motivational banner with weekly averages
- **Weekly Summary**: Track weight loss trends and averages
- **Push Notifications**: AM & PM reminders via service worker
- **Offline-First**: Full functionality without internet connection

### 📱 PWA Features
- **Installable**: Add to home screen on mobile and desktop
- **Responsive Design**: Optimized for all screen sizes
- **Fast & Smooth**: Instant updates with optimistic UI
- **No Auth Required**: Single-user system, no login needed
- **Keyboard & Touch Accessible**: Full support for all input methods

### 🎨 Design
- Beautiful flat gradient backgrounds
- Big, touch-friendly tap targets
- Minimal UI with no unnecessary menus
- Everything visible in one screen
- Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- A [Turso](https://turso.tech) account (free tier available)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd winter-habit-tracking
npm install
```

### 2. Set Up Database

Create a Turso database:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create winter-arc

# Get database URL
turso db show winter-arc

# Create auth token
turso db tokens create winter-arc
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Turso credentials:

```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### 4. Initialize Database

```bash
npm run db:setup
```

This creates all tables and inserts the default habits.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📦 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/winter-habit-tracking)

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   In Vercel dashboard → Settings → Environment Variables:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

## 📱 Installing as PWA

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen" or "Install app"
4. Tap "Install"

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Click "Install"

## 🎯 Default Habits

The app comes pre-configured with these habits:

1. ✅ Hit 200g+ protein
2. ✅ Bank 500+ cal deficit
3. ✅ Weigh-in logged
4. ✅ Resistance or cardio training done
5. ✅ All meals logged
6. ✅ Sleep >7hrs
7. ✅ Injury check-in
8. ✅ Tomorrow's food prep confirmed
9. ✅ Fruit budget system executed
10. ✅ Cafeteria discipline
11. ✅ Social meal check-in

You can customize these by editing the database schema or through the app settings (future feature).

## 🏗️ Project Structure

```
winter-habit-tracking/
├── pages/
│   ├── _app.tsx              # App wrapper with PWA setup
│   ├── _document.tsx         # HTML document structure
│   ├── index.tsx             # Main app page
│   └── api/
│       ├── habits.ts         # Habit CRUD operations
│       ├── habit-logs.ts     # Daily completion logs
│       ├── numeric-logs.ts   # Numeric metrics API
│       ├── momentum.ts       # Stats and momentum calculations
│       └── reminders.ts      # Notification reminders API
├── src/
│   ├── components/
│   │   ├── HabitItem.tsx     # Individual habit checkbox
│   │   ├── NumericLog.tsx    # Numeric input component
│   │   ├── MomentumBanner.tsx # Status banner
│   │   ├── WeeklySummary.tsx # Weekly stats display
│   │   └── ReminderSetup.tsx # Notification settings
│   ├── hooks/
│   │   ├── useHabits.ts      # Habit state management
│   │   ├── useLogs.ts        # Numeric logs state
│   │   ├── useMomentum.ts    # Momentum calculations
│   │   └── useNotifications.ts # PWA notifications
│   ├── lib/
│   │   └── db.ts             # Database client
│   ├── db/
│   │   └── schema.sql        # Database schema
│   └── styles/
│       └── globals.css       # Global styles
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icon-*.png            # PWA icons (to be generated)
└── scripts/
    ├── setup-db.js           # Database initialization
    └── generate-icons.js     # Icon generation helper
```

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      winter: {
        500: '#0ea5e9', // Primary color
        // ... other shades
      },
    },
  },
}
```

### Modify Habits

Edit `src/db/schema.sql` and run `npm run db:setup` again, or modify directly in the database.

### Adjust Reminders

Default reminders are 8:00 AM and 9:00 PM. Change these in `src/db/schema.sql` or through the app's settings panel.

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run db:setup   # Initialize database
```

### Adding New Features

1. **New API Route**: Add to `pages/api/`
2. **New Hook**: Add to `src/hooks/`
3. **New Component**: Add to `src/components/`
4. **Database Changes**: Modify `src/db/schema.sql` and re-run setup

## 📊 Database Schema

- **habits**: List of daily habits
- **habit_logs**: Daily completion records
- **numeric_logs**: Weight, calories, protein, etc.
- **reminders**: Notification schedule

See `src/db/schema.sql` for full schema.

## 🔔 Notifications

Push notifications require user permission. The app will prompt on first load. Notifications are scheduled via the service worker at configured reminder times.

**Note**: For production notifications, consider using a service like [OneSignal](https://onesignal.com/) or [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging).

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
- Ensure database is created: `turso db show winter-arc`
- Check Turso CLI is installed: `turso --version`

### Service Worker Not Registering
- Ensure you're using HTTPS or localhost
- Clear browser cache and hard reload
- Check console for service worker errors

### Icons Not Showing
- Generate icons using the provided script or online tools
- Place generated icons in `public/` directory
- Names must match manifest.json references

### Notifications Not Working
- Grant notification permission in browser settings
- Ensure service worker is registered
- Check that reminders are enabled in settings

## 📝 License

MIT License - feel free to use for personal or commercial projects!

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Turso](https://turso.tech) - Serverless SQLite
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Deployment platform

---

**Winter Arc Protocol** - Your journey to transformation starts here. 💪❄️
