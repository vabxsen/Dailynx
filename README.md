# Dailynx

A personal, installable habit tracker — build your daily time table, check off
habits, and watch your streaks grow. Everything syncs to the cloud and works
offline as a PWA.

**Live app:** https://dailynx.web.app/

## Features

- 📅 **Daily time table** — schedule habits by time and check them off each day
- 🔁 **Auto-reset at midnight** — completion is tracked per date, so today's
  list clears itself at your local midnight (no server job needed)
- 🔥 **Streaks & stats** — current streak, best streak, monthly counts, and a
  today-progress bar
- 📊 **Analytics** — weekly/monthly completion charts and a streak leaderboard
- 🗓️ **Calendar heatmap** — see every day's completion at a glance
- 👤 **Profile** — set your name, username, and bio
- ☁️ **Cloud sync + offline** — Firebase Auth + Firestore with offline cache
- 📱 **Installable PWA** — add to your home screen on any device

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Firebase (Auth + Firestore + Hosting)
- framer-motion (animations), Recharts (charts), lucide-react (icons)
- vite-plugin-pwa (service worker + manifest)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # lint
```

To run your own instance, create a Firebase project, enable Google
authentication and Firestore, and replace the config in
`src/firebase/firebase.ts`. Security rules live in `firestore.rules`.

## Deploy

```bash
npm run build
firebase deploy --only hosting          # deploy the site
firebase deploy --only firestore:rules  # deploy security rules
```
