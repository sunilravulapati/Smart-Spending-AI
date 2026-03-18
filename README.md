# ProsperOS — AI-Powered Personal Finance System

> **v2.0** — Now with Vite, MongoDB, JWT auth (HTTP-only cookies), and a full Express backend.

**ProsperOS** is a privacy-first financial operating system built for the Indian middle class. It calculates your "True Free Cash," tracks Net Worth, forecasts future savings, and uses Groq AI to provide personalized financial strategy — secured behind JWT authentication with HTTP-only cookies.

---

## What's new in v2.0

| | v1 (Frontend only) | v2 (Current) |
|---|---|---|
| Data storage | `localStorage` | MongoDB Atlas |
| Auth | None | JWT + HTTP-only cookies |
| AI provider | Ollama (local) | Groq API (cloud) |
| Build tool | Create React App | Vite |
| Backend | None | Node.js + Express |
| Multi-device | No | Yes |

---

## Features

### Smart Dashboard
- **Financial Health Score** — composite 0–100 score across savings rate, debt ratio, emergency runway and net worth
- **Money Map** — visual breakdown of Bills vs. EMIs vs. Goals vs. Free Cash
- **Debt Destroyer** — DTI (Debt-to-Income) ratio and total liability tracker
- **Net Worth Tracker** — real-time Assets minus Liabilities
- **Emergency Runway** — months of coverage based on your liquid assets

### AI Strategy (Groq-Powered)
- **Powered by Llama 3.3 70B** via Groq API — fast, free tier available
- **Opportunity Cost Engine** — "Reality Check" widget showing the 10-year future value of any wishlist purchase if invested instead
- **Spending Verdict** — Safe or Risky judgement with full financial context
- **Smart Alert Banner** — proactive warnings for bill clusters, low runway, high DTI

### Forecasting & Simulation
- **12-Month Forecast** — projects your savings with and without wishlist purchases
- **"What If?" Simulator** — stress-test your budget against income changes and expense inflation, with live savings rate and expense ratio metrics
- **Bill Calendar** — see exactly which days cash leaves your account this month

### Data & Security
- **HTTP-only cookies** — JWT tokens never stored in `localStorage`, safe from XSS
- **MongoDB persistence** — your data syncs across devices and survives browser clears
- **PDF Reports** — generate professional financial audit reports via jsPDF
- **Milestone rings** — goal progress rings with projected completion dates

---

## Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Recharts** — charts and visualizations
- **Lucide React** — icons
- **React Router DOM v7** — routing with `createBrowserRouter`
- **jsPDF + html2canvas** — PDF report generation

### Backend
- **Node.js + Express 5**
- **MongoDB + Mongoose** — data persistence
- **JWT (jsonwebtoken)** — authentication
- **bcryptjs** — password hashing
- **cookie-parser** — HTTP-only cookie handling

### AI
- **Groq API** — Llama 3.3 70B for financial analysis
- Response format: structured JSON with assessment, strategies and verdict

---

## Project Structure

```
Smart-Spending-AI/
├── frontend/                  # Vite + React app
│   ├── src/
│   │   ├── components/        # ExpenseCard, Dashboard, AlertBanner, etc.
│   │   ├── utils/
│   │   │   ├── api.js         # All fetch calls to backend
│   │   │   └── helpers.js     # GROQ_MODELS, calculateEMI, etc.
│   │   ├── App.jsx            # Main dashboard (protected route)
│   │   └── main.jsx           # Router setup
│   └── .env                   # VITE_GROQ_API=your_key
│
└── backend/                   # Express API
    ├── apis/
    │   ├── auth.js            # /register, /login, /logout, /me
    │   └── data.js            # GET/POST financial data
    ├── middleware/
    │   └── auth.js            # JWT cookie verification
    ├── models/
    │   ├── User.js            # email + hashed password
    │   └── FinancialData.js   # income, expenses, goals, assets, wishlist
    ├── server.js
    └── .env                   # MONGO_URI, PORT, JWT_SECRET
```

---

## Getting Started

### Prerequisites
- **Node.js 18+**
- **MongoDB Atlas** account (free tier) — [mongodb.com/atlas](https://mongodb.com/atlas)
- **Groq API key** (free) — [console.groq.com](https://console.groq.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/sunilravulapati/Smart-Spending-AI.git
cd Smart-Spending-AI
```

---

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/prosperos
PORT=5000
JWT_SECRET=pick_any_long_random_string_here
NODE_ENV=development
```

> Get your `MONGO_URI` from MongoDB Atlas → Connect → Drivers → copy the connection string.

Start the backend:

```bash
npm run dev
```

You should see:
```
DB connection success!
Server started on port 5000
```

---

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_GROQ_API=gsk_your_groq_api_key_here
```

> Get your Groq API key from [console.groq.com](https://console.groq.com) — free tier includes Llama 3.3 70B.

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

### 4. Register and log in

1. Go to `/register` — create your account (no token issued at this stage)
2. Go to `/login` — enter credentials, JWT is set as an HTTP-only cookie
3. You'll be redirected to `/dashboard` automatically

---

## Deployment status

> ⚠️ **The backend is not yet deployed.** To use the full app with data persistence and auth, you need to run the backend locally on port 5000 following the steps above.
>
> Frontend is deployed on Vercel: [smart-spending-ai.vercel.app](https://github.com/sunilravulapati/Smart-Spending-AI)
>
> Backend deployment (Render / Railway) is in progress.

For the deployed frontend to work with a deployed backend, update `frontend/src/utils/api.js`:

```js
// Change this line:
const BASE = 'http://localhost:5000/api'

// To your deployed backend URL:
const BASE = 'https://your-backend.onrender.com/api'
```

Also set `NODE_ENV=production` in your backend environment variables so cookies use `secure: true` and `sameSite: 'none'`.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default 5000) |
| `JWT_SECRET` | Any long random string for signing tokens |
| `NODE_ENV` | `development` or `production` |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_GROQ_API` | Your Groq API key (starts with `gsk_`) |

---

## Security model

- Passwords are hashed with **bcryptjs** (12 salt rounds) before storage
- JWT tokens are stored exclusively in **HTTP-only cookies** — JavaScript cannot access them
- Cookies use `sameSite: strict` in development and `sameSite: none` + `secure: true` in production
- The `/api/data` route is fully protected — every request is verified against the JWT before any DB operation
---
### Demo Video (since backend needs to be deployed):
- Link: https://drive.google.com/file/d/1QqpgQOmoBlTMcZJ7h6ImDBXs8SoVfxcd/view?usp=sharing