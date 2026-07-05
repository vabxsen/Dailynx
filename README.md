<p align="center">
  <img src="public/pwa-512.png" alt="Dailynx logo" width="112" height="112" />
</p>

<h1 align="center">Dailynx</h1>

<p align="center">
  <em>Build better, every day.</em><br/>
  A modern, installable habit tracker with streaks, XP levels, achievements,
  sleep tracking, and an AI coach.
</p>

<p align="center">
  <a href="https://dailynx.web.app"><strong>🚀 Live app → dailynx.web.app</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Hosting-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## ✨ Features

### Core habit tracking
- 📅 **Daily time table** — schedule habits by time and check them off each day
- 🔁 **Auto-reset at midnight** — completion is tracked per date, so today's list
  clears itself at your local midnight (no server job needed)
- 🔥 **Streaks & stats** — current streak, best streak, monthly counts, and a
  today-progress ring
- ✅ **To-do list** — quick daily tasks alongside your habits

### Progression & motivation
- ⚡ **XP & Levels** — earn XP for every habit and task. Climb from **Level 0 to
  100** on a rising curve (each level costs 50 XP more than the last), with a
  one-time level-up animation. XP is **permanent** — it never decreases, even if
  a habit is edited, unchecked, or deleted.
- 🏆 **Achievements** — 13 unlockable badges across streaks, total completions,
  perfect weeks, and consistency, each granting bonus XP with a celebration on
  unlock.
- 🤖 **AI Coach** *(optional)* — a Gemini-powered chat that gives personalized
  motivation and answers "how do I…" questions about the app. See
  [AI Coach setup](#-ai-coach-optional).

### Tracking & insight
- 😴 **Sleep tracker** — log bedtime & wake time, auto-compute duration and a
  quality rating against a configurable goal (default 8h), with weekly/monthly
  charts
- 📊 **Analytics** — weekly/monthly completion charts, a streak leaderboard, and
  your level & total XP
- 🗓️ **Calendar heatmap** — see every day's completion at a glance

### Account & platform
- 👤 **Profile & unique usernames** — globally unique usernames, editable once
  then permanently locked
- ☁️ **Cloud sync + offline** — Firebase Auth (Google) + Firestore with an
  offline cache
- 📱 **Installable PWA** — add it to your home screen on any device

---

## 🛠 Tech stack

| Layer | Tools |
|-------|-------|
| Framework | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4 |
| Backend | Firebase — Auth, Firestore, Hosting |
| UI / motion | framer-motion, Recharts, lucide-react |
| PWA | vite-plugin-pwa (service worker + manifest) |
| AI | Google Gemini API (`gemini-2.5-flash`) |

---

## 🧱 Architecture

A clean, layered structure keeps data access, state, and UI separate:

- **`src/services/`** — Firestore data access, one module per collection. Pure
  functions, no React.
- **`src/contexts/`** — React state wrapping the services (auth, habits, XP,
  achievements, sleep, profile).
- **`src/pages/` + `src/components/`** — one folder per route; feature-grouped,
  reusable components.
- **`src/utils/`** — pure, testable logic: local-date keys, streak math, the XP
  curve, sleep math, and achievement progress.

### Data model

All collections are per-user and locked down server-side in `firestore.rules`
(XP can only ever grow, achievements can't be un-earned, usernames stay reserved):

| Collection | Holds |
|------------|-------|
| `users/{uid}` | profile, XP total, unlocked achievements, sleep goal |
| `habits/{id}` | title, scheduled time, `completedDates[]`, `xpAwardedDates[]` |
| `todos/{id}` | text, done, `xpAwarded` |
| `sleepLogs/{id}` | date, bedtime, wake time, duration |
| `usernames/{name}` | reservation doc that keeps usernames globally unique |

---

## 🚀 Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build (tsc + vite)
npm run lint     # lint
```

To run your own instance:

1. Create a Firebase project, enable **Google authentication** and **Firestore**.
2. Replace the config in `src/firebase/firebase.ts` with your project's config.
3. Deploy the security rules (see [Deploy](#-deploy)).

---

## 🤖 AI Coach (optional)

The AI Coach uses Google's Gemini API. It's entirely optional — without a key,
the coach is simply hidden and the rest of the app works normally.

1. Get a free key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env.local` and add your key:

   ```bash
   VITE_GEMINI_API_KEY=your_key_here
   ```

> ⚠️ This is a client-side app, so the key is embedded in the built bundle and is
> publicly visible on the deployed site. Restrict the key to the **Generative
> Language API** (and to your domain) in the Google Cloud console, and keep it on
> the free tier so the worst case is a rate limit, not a bill.

---

## 📦 Deploy

```bash
npm run build
firebase deploy --only hosting          # deploy the site
firebase deploy --only firestore:rules  # deploy security rules
```

---

## 📁 Project structure

```
src/
├─ components/   # feature-grouped UI (dashboard, habits, sleep, xp, achievements, ai, layout, ui)
├─ contexts/     # React state (auth, profile, habits, xp, achievements, sleep)
├─ pages/        # one folder per route
├─ services/     # Firestore data access, one module per collection
├─ hooks/        # small reusable hooks (e.g. useTodos, usePwaInstall)
├─ utils/        # pure logic: dates, streaks, xp curve, sleep, achievements
├─ layouts/      # app shell
├─ routers/      # routes + auth guards
└─ firebase/     # Firebase init
```

---

## 📄 License

[MIT](LICENSE) © 2026 Vaibhav Sen
