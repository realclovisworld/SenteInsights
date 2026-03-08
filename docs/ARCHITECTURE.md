# Architecture Overview

MoMoSense Insights is a client-side React application that parses mobile money PDF statements, displays transaction insights, and persists data to Supabase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Authentication | Clerk |
| Database / Backend | Supabase (PostgreSQL + RLS) |
| State Management | React Query (TanStack Query) |
| Routing | React Router DOM |
| PDF Parsing | pdfjs-dist (client-side) |
| Testing | Vitest + React Testing Library |

---

## High-Level Diagram

```
Browser
  └─ React App (Vite SPA)
       ├─ ClerkProvider  (src/main.tsx)
       │    └─ Authentication / session management
       ├─ QueryClientProvider  (src/App.tsx)
       │    └─ Server-state caching for Supabase queries
       ├─ React Router  (src/App.tsx)
       │    └─ Page-level code splitting
       └─ Supabase JS Client  (src/integrations/supabase/client.ts)
            └─ PostgreSQL via PostgREST + RLS
```

---

## Key Entry Points

### `src/main.tsx`
Bootstrap file. Wraps the app in `ClerkProvider` using `VITE_CLERK_PUBLISHABLE_KEY` and mounts the React tree into `#root`.

### `src/App.tsx`
Composes top-level providers (`QueryClientProvider`, `TooltipProvider`, toasters) and defines all client-side routes via `BrowserRouter`. Also contains a top-level `ErrorBoundary`.

---

## Core Modules

### `src/lib/pdfParser.ts`
Responsible for extracting transaction data from uploaded PDF files.

- **`parsePDF(file: File)`** – Entry point. Detects provider and delegates to the appropriate parser.
- **`parseMTN()`** – Parses MTN MoMo statement format. Handles DD-MM-YYYY, DD/MM/YYYY, and YYYY-MM-DD date formats.
- **`parseAirtel()`** – Parses Airtel Money statement format.
- **`detectProvider()`** – Identifies whether a PDF belongs to MTN or Airtel based on text content.
- **`categorize(description)`** – Auto-categorises transactions (Airtime, Utilities, Bank Payment, Food, etc.).

Returns a `ParsedStatement` containing account info, date range, and an array of `ParsedTransaction` objects.

### `src/lib/supabase-helpers.ts`
All client-side database interactions for regular users.

| Function | Table(s) | Description |
|---|---|---|
| `getOrCreateProfile()` | `profiles` | Ensures a profile row exists for the current user |
| `checkPageLimit()` | `profiles` | Checks daily/monthly page usage against plan limits |
| `incrementPageCount()` | `profiles` | Increments usage counters after a successful parse |
| `saveStatementToSupabase()` | `statements`, `transactions`, `insights` | Persists a full parsed statement |
| `fetchRecentStatements()` | `statements` | Returns the 5 most recent statements |
| `fetchStatementTransactions()` | `transactions` | Returns all transactions for a statement |
| `fetchStatementInsights()` | `insights` | Returns AI insights for a statement |
| `fetchFullStatement()` | `statements`, `transactions`, `insights` | Reconstructs a complete statement object |

### `src/lib/admin-helpers.ts`
Admin-only queries used by the `/admin` page.

- Overview stats (total users, revenue, statements)
- Revenue and signup chart data
- Payment request management (approve / reject)
- User management (ban, unban, update plan, delete)
- Admin settings CRUD

### `src/lib/plans.ts`
Defines plan tiers and enforces feature access.

- **Plan tiers**: `anonymous`, `free`, `starter`, `pro`, `business`, `enterprise`
- **`getPlanFeature(plan, feature)`** – Returns the value of a feature for a given plan.
- **`hasFeature(plan, feature)`** – Boolean check for feature availability.
- **`getNextPlan(plan)`** – Returns the next upgrade tier.
- Anonymous usage is tracked in `localStorage`.

### `src/integrations/supabase/client.ts`
Initialises the Supabase JS client with the project URL and anon key from environment variables. Configures `localStorage` session persistence and automatic token refresh.

### `src/integrations/supabase/types.ts`
Auto-generated TypeScript types for the Supabase database schema. These types are passed as a generic to `createClient<Database>()` for end-to-end type safety. Regenerate with:

```bash
npx supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts
```

---

## Pages

| File | Route | Purpose |
|---|---|---|
| `src/pages/Index.tsx` | `/` | Landing page with hero and feature sections |
| `src/pages/Dashboard.tsx` | `/dashboard` | Main app – upload, parse, view insights |
| `src/pages/Converter.tsx` | `/converter` | Standalone PDF conversion tool |
| `src/pages/Pricing.tsx` | `/pricing` | Plan comparison and upgrade CTAs |
| `src/pages/Admin.tsx` | `/admin` | Admin dashboard |
| `src/pages/Login.tsx` | `/login` | Clerk-powered sign-in |
| `src/pages/Register.tsx` | `/register` | Clerk-powered sign-up |

---

## Data Flow

```
User uploads PDF
      │
      ▼
pdfParser.ts (client-side, pdfjs-dist)
      │ ParsedStatement
      ▼
Dashboard.tsx (display charts, tables)
      │ on save
      ▼
supabase-helpers.ts → Supabase DB
      │
      ├─ statements table
      ├─ transactions table
      └─ insights table
```

---

## Authentication Flow

```
User visits protected route
      │
      ▼
ProtectedRoute (checks Clerk session)
      │ unauthenticated
      ▼
Redirect to /login
      │ authenticated
      ▼
ClerkProvider provides useAuth() / useUser() hooks
      │
      ▼
Supabase queries use Clerk user ID as user_id
```

---

## Environment Configuration

All runtime configuration is injected via Vite environment variables (prefixed `VITE_`). See `.env.example` for the full list. Never commit `.env`.
