# MoMoSense Insights

**MoMoSense Insights** is a web application that parses mobile money PDF statements from MTN MoMo and Airtel Money (Uganda), extracts transactions, and provides visual spending insights, AI-generated summaries, and exportable reports.

---

## Features

- 📄 **PDF parsing** — Upload MTN MoMo or Airtel Money statements; transactions are extracted client-side.
- 📊 **Visual insights** — Spending charts, monthly trends, income sources, and stat cards.
- 🤖 **AI insights** — Auto-generated text summaries of spending patterns.
- 🗂️ **Statement history** — Saved statements and transactions persisted to Supabase.
- 🔒 **Authentication** — Clerk-powered sign-in / sign-up.
- 📦 **Plan-based gating** — Free, Starter, Pro, Business, and Enterprise tiers with per-page limits and feature flags.
- 🛡️ **Admin panel** — User management, payment request approval, and settings.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Authentication | Clerk |
| Database | Supabase (PostgreSQL + RLS) |
| State Management | TanStack Query (React Query) |
| Routing | React Router DOM |
| PDF Parsing | pdfjs-dist (client-side) |
| Testing | Vitest + React Testing Library |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/gideon-tech/momosense-insights.git
cd momosense-insights

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Supabase and Clerk credentials

# 4. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
VITE_SUPABASE_PROJECT_ID=your_project_ref
VITE_SUPABASE_URL=https://your_project_ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

> ⚠️ Never commit `.env`. It is listed in `.gitignore`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (output: `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## Project Structure

```
src/
├── main.tsx                    # Entry point — mounts ClerkProvider
├── App.tsx                     # Router + top-level providers
├── pages/                      # One file per route
├── components/                 # Reusable UI components
│   ├── ui/                    # shadcn/ui primitives
│   └── admin/                 # Admin-specific components
├── lib/
│   ├── pdfParser.ts           # PDF → transaction extraction
│   ├── supabase-helpers.ts    # DB read/write helpers
│   ├── admin-helpers.ts       # Admin dashboard queries
│   └── plans.ts               # Plan definitions & feature gating
├── hooks/                      # Custom React hooks
└── integrations/
    └── supabase/
        ├── client.ts          # Supabase JS client
        └── types.ts           # Generated database types
```

---

## Documentation

- [Developer Guide](docs/DEVELOPERS.md) — Local setup, env vars, core flows, troubleshooting
- [Architecture](docs/ARCHITECTURE.md) — Technical architecture and key modules
- [Supabase Reference](docs/SUPABASE.md) — Database tables, RLS, and generated types
- [Contributing](docs/CONTRIBUTING.md) — Branching, code style, and PR guidelines

---

## Deployment

The app is deployed via [Lovable](https://lovable.dev/). Push to the connected branch to trigger a build and deploy.

Ensure all environment variables (`VITE_SUPABASE_*`, `VITE_CLERK_PUBLISHABLE_KEY`) are configured in the hosting environment.
