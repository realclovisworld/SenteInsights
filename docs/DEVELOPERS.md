# Developer Guide

This guide is for engineers onboarding onto the **MoMoSense Insights** project. It covers local setup, environment variables, architecture overview, routing, core flows, testing/linting, deployment, and security notes.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Running Locally](#running-locally)
3. [Environment Variables](#environment-variables)
4. [Architecture Overview](#architecture-overview)
5. [Routing](#routing)
6. [Core Flows](#core-flows)
7. [Testing & Linting](#testing--linting)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Security Notes](#security-notes)

---

## Prerequisites

- **Node.js** ≥ 18 (or [Bun](https://bun.sh/) ≥ 1.0)
- **npm** ≥ 9 (or Bun as package manager)
- A [Supabase](https://supabase.com/) project with the required tables (see [docs/SUPABASE.md](./SUPABASE.md))
- A [Clerk](https://clerk.com/) application (for authentication)

---

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/gideon-tech/momosense-insights.git
cd momosense-insights

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Edit .env and fill in your real values (see Environment Variables below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Environment Variables

Copy `.env.example` to `.env` and populate the following variables:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project reference ID |
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. `https://<ref>.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_test_...` or `pk_live_...`) |

> **Never commit `.env` to version control.** It is listed in `.gitignore`.

The Supabase client is initialised in `src/integrations/supabase/client.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

The Clerk provider is bootstrapped in `src/main.tsx` using `VITE_CLERK_PUBLISHABLE_KEY`.

---

## Architecture Overview

See [docs/ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed technical breakdown.

**Quick summary:**

```
src/
├── main.tsx              # React entry point – mounts ClerkProvider
├── App.tsx               # Router + providers (QueryClient, Tooltip, Toaster)
├── pages/                # One file per route
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   └── admin/           # Admin-only components
├── lib/
│   ├── pdfParser.ts     # PDF → transaction extraction
│   ├── supabase-helpers.ts  # Database read/write helpers
│   ├── admin-helpers.ts     # Admin dashboard queries
│   └── plans.ts             # Plan definitions & feature gating
├── hooks/                # Custom React hooks
└── integrations/
    └── supabase/
        ├── client.ts    # Supabase JS client
        └── types.ts     # Generated database TypeScript types
```

---

## Routing

Routes are defined in `src/App.tsx` using React Router's `BrowserRouter`:

| Path | Component | Notes |
|---|---|---|
| `/` | `Index` | Landing / home page |
| `/dashboard` | `Dashboard` | Statement upload & insights (protected) |
| `/converter` | `Converter` | PDF conversion tool |
| `/pricing` | `Pricing` | Plan comparison |
| `/admin` | `Admin` | Admin panel (admin users only) |
| `/about` | `About` | About page |
| `/privacy` | `Privacy` | Privacy policy |
| `/terms` | `Terms` | Terms of service |
| `/api-usage` | `ApiUsage` | API usage stats |
| `/login` | `Login` | Sign in |
| `/register` | `Register` | Sign up |
| `*` | `NotFound` | 404 fallback |

Protected routes use the `ProtectedRoute` component which checks Clerk's authentication state.

---

## Core Flows

### Dashboard Upload & Parse

1. User visits `/dashboard` and uploads a PDF statement.
2. `FileUpload` (or `BatchFileUpload`) component calls `parsePDF()` from `src/lib/pdfParser.ts`.
3. `parsePDF` detects the provider (MTN MoMo or Airtel Money), extracts transactions, and returns a `ParsedStatement` object.
4. The parsed data is displayed in `TransactionTable`, `SpendingChart`, `MonthlyTrend`, `StatCards`, etc.
5. On save, `saveStatementToSupabase()` from `src/lib/supabase-helpers.ts` persists the statement, individual transactions, and AI-generated insights.

### Usage Gating

Plan limits are enforced via `src/lib/plans.ts`:

- Each plan has a maximum number of PDF pages per day and per month.
- `checkPageLimit()` in `supabase-helpers.ts` queries the user's `profiles` row to verify they have not exceeded their limit.
- If a feature is unavailable on the user's current plan, `FeatureGate` / `UpgradeModal` components prompt an upgrade.
- Anonymous users (not signed in) are tracked via `localStorage` and limited to the `anonymous` plan tier.

### Supabase Persistence

- `getOrCreateProfile()` – creates or fetches the authenticated user's profile row.
- `saveStatementToSupabase()` – writes to `statements`, `transactions`, and `insights` tables.
- `fetchRecentStatements()`, `fetchStatementTransactions()`, `fetchStatementInsights()` – retrieve saved data for display in `StatementHistory`.

See [docs/SUPABASE.md](./SUPABASE.md) for the full table schema reference.

---

## Testing & Linting

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Lint the codebase
npm run lint
```

Tests are located in `src/test/` and use [Vitest](https://vitest.dev/). UI tests use React Testing Library.

When adding features:

1. Write or update tests in `src/test/`.
2. Ensure `npm run lint` passes with no errors.
3. Run `npm run build` to confirm a clean production build.

---

## Deployment

The app is deployed via [Lovable](https://lovable.dev/). Any push to the connected branch triggers an automatic build and deploy.

For manual builds:

```bash
npm run build     # Outputs to dist/
npm run preview   # Preview the production build locally
```

Ensure all environment variables are configured in the hosting environment (not just in `.env`).

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Missing Publishable Key` error on load | `VITE_CLERK_PUBLISHABLE_KEY` is not set | Add the key to `.env` and restart the dev server |
| Supabase queries returning `null` / 401 | `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` is wrong | Verify values in `.env` match your Supabase project settings |
| `RLS error` / `permission denied` | Row Level Security policies not configured | Enable and configure RLS policies in Supabase (see [docs/SUPABASE.md](./SUPABASE.md)) |
| PDF parse returns empty transactions | PDF format not supported | Currently only MTN MoMo and Airtel Money Uganda PDFs are supported |
| App crashes on route change | Missing or mis-matched route | Check `src/App.tsx` route definitions |

---

## Security Notes

- **`.env` must never be committed.** It is in `.gitignore`. Use `.env.example` as a reference.
- **Supabase anon key** is safe to expose to the browser, but Row Level Security (RLS) **must** be configured on all tables so users can only access their own data.
- **Clerk** handles authentication tokens. Do not store auth tokens in `localStorage` manually.
- **Admin routes** should be guarded so that only users with an admin role can access `/admin`. Review `src/components/admin/` and the `ProtectedRoute` component.
- Keep Supabase service-role keys **server-side only** and never include them in client-side code.
