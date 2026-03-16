# StockSense — IOP Project 2026

A real-time stock market dashboard with portfolio simulation, built with plain HTML/CSS/JS, Firebase, and Alpha Vantage.

**Live via:** GitHub Pages  
**Backend:** Firebase (Auth + Firestore)  
**Market data:** Alpha Vantage API

---

## Project Structure

```
stocksense/
  index.html          ← Login / Sign-up page
  dashboard.html      ← Live charts, search, news, watchlist
  portfolio.html      ← Trade simulator, holdings, P&L
  css/
    style.css         ← Full design system
    sidebar.css       ← Collapsible sidebar
  js/
    firebase.js       ← Firebase config (edit this first!)
    auth.js           ← Login, signup, logout, auth guard
    sidebar.js        ← Sidebar + toast notifications
    api.js            ← Alpha Vantage calls + mock fallbacks
  README.md
```

---

## Setup — Step by Step

### Step 1 — Firebase project

1. Go to https://console.firebase.google.com
2. Click "Add project" → name it `stocksense` → Continue
3. In your project: **Build → Authentication → Get Started**
   - Enable **Email/Password** provider
4. **Build → Firestore Database → Create database**
   - Start in **test mode** (you can add security rules later)
   - Choose a region close to you (e.g. `asia-south1` for India)
5. **Project Settings (⚙️) → Your apps → Add app → Web (</>)**
   - Register app → copy the `firebaseConfig` object

6. Open `js/firebase.js` and paste your config:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "stocksense-xxxxx.firebaseapp.com",
  projectId: "stocksense-xxxxx",
  storageBucket: "stocksense-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
```

### Step 2 — Alpha Vantage API key

1. Go to https://www.alphavantage.co/support/#api-key
2. Fill in the form → free API key emailed instantly
3. Open `js/api.js` and replace:

```js
const API_KEY = "YOUR_ALPHA_VANTAGE_KEY";
```

> **Note:** The free tier allows 25 API calls/day, 5/minute.
> The app uses mock data as fallback when the limit is hit, so it will always work.

### Step 3 — Firestore Security Rules (optional but recommended)

In Firebase Console → Firestore → Rules, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures each user can only access their own data.

### Step 4 — Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `stocksense`)
2. Push all files to the `main` branch:

```bash
git init
git add .
git commit -m "Initial commit — StockSense IOP 2026"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stocksense.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Source → Deploy from branch → main / root**
4. Your app is live at: `https://YOUR_USERNAME.github.io/stocksense/`

---

## Features

- **Email + password login** with Firebase Auth (supports 2-3+ users)
- **Per-user data** stored in Firestore: balance, watchlist, trade history
- **Live stock quotes** from Alpha Vantage (with mock fallback)
- **Interactive charts** — 1W / 1M / 3M range via Chart.js
- **Stock search** — search any symbol or company name
- **Buy/Sell simulator** — $10,000 starting virtual balance per user
- **Holdings tracker** — average price, P&L, return %
- **Watchlist management** — add/remove symbols, synced to cloud
- **Collapsible sidebar** — works on desktop and mobile
- **Fully responsive** — mobile-friendly layout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS (ES Modules) |
| Charts | Chart.js 4.x |
| Auth + DB | Firebase 10 (Auth + Firestore) |
| Market data | Alpha Vantage API |
| Hosting | GitHub Pages |
| Fonts | DM Sans + DM Mono (Google Fonts) |
