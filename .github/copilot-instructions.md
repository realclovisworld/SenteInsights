# Copilot Instructions for SenteInsights

**SenteInsights** is an AI-powered financial analysis platform for African mobile money users (MTN MoMo, Airtel Money). Users upload statements as PDFs for instant spending insights, visual analytics, and financial tracking.

## Build, Test & Lint

### Quick Start
```bash
npm install                    # Install dependencies (also: bun install)
npm run dev                    # Start dev server at http://localhost:5173
npm run build                  # Production build
npm run lint                   # Run ESLint
npm run test                   # Run test suite once
npm run test:watch            # Run tests in watch mode (interactive)
```

### Build Modes
- **`npm run build`** - Standard production build
- **`npm run build:dev`** - Development mode build with debugging aids
- **`npm run preview`** - Preview production build locally

### Testing Details
- **Framework**: Vitest
- **Environment**: jsdom (browser simulation)
- **Setup File**: `src/test/setup.ts`
- **Test Files**: `src/**/*.{test,spec}.{ts,tsx}`
- **Single Test**: `npm run test -- src/path/to/file.test.ts`

### Linting
- Uses ESLint with TypeScript support
- Config: `eslint.config.js`
- Notable: `@typescript-eslint/no-unused-vars` is **disabled** (intentional)
- `strictNullChecks` is disabled in TypeScript

## High-Level Architecture

### Project Structure
```
src/
├── pages/              # Route components (Index, Dashboard, Pricing, Admin, etc.)
├── components/
│   ├── admin/         # Admin dashboard UI (AdminUsers, AdminPayments, etc.)
│   └── ui/            # shadcn-ui primitives (auto-generated)
├── lib/               # Core business logic
│   ├── pdfParser.ts   # PDF statement extraction & transaction parsing
│   ├── supabase-helpers.ts  # Database operations & user management
│   ├── admin-helpers.ts     # Admin-specific DB operations
│   ├── plans.ts       # Subscription tier definitions
│   └── utils.ts       # General utilities
├── hooks/             # Custom React hooks (e.g., use-mobile, use-toast)
├── integrations/
│   └── supabase/      # Supabase client & TypeScript types
└── App.tsx            # Root component with routing & error boundary
```

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Build**: Vite (with SWC for fast transpilation)
- **Styling**: Tailwind CSS + shadcn-ui components
- **UI Framework**: Radix UI (headless components)
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **Auth**: Clerk (secure user management)
- **Backend**: Supabase (PostgreSQL + RLS)
- **PDF Processing**: pdfjs-dist (client-side parsing)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### Core Flows

#### 1. **PDF Statement Upload & Parsing**
- User uploads MTN MoMo or Airtel Money PDF statement
- `pdfParser.ts` extracts text and parses transactions
- Returns `ParsedStatement` with structured transaction array
- Transactions categorized (e.g., transfers, payments, fees)

#### 2. **User Authentication & Profiles**
- Clerk handles authentication (email sign-up/login)
- `supabase-helpers.ts` → `getOrCreateProfile()` auto-creates profile on first login
- Profiles track: pages used (daily/monthly), subscription tier, upload history
- Daily/monthly quotas reset automatically

#### 3. **Admin Dashboard**
- Route: `/admin` (requires admin role)
- Components in `src/components/admin/`
- Access: user management, payment tracking, platform statistics, maintenance mode
- Admin role enforcement via Supabase RLS

#### 4. **Subscription & Plans**
- `plans.ts` defines tiers (Free, Basic, Pro, Premium)
- Plan features tied to page limits and upload capacity
- Premium tier allows batch processing
- Payments tracked in Supabase

### Key Conventions

#### Component Patterns
- **UI Components**: Imported from `@/components/ui/` (shadcn-ui wrappers)
- **Page Components**: Direct exports, not in `components/` directory
- **Protected Routes**: Use `<ProtectedRoute>` wrapper for auth-required pages
- **Admin Routes**: Check role via Supabase in component or via RLS

#### Data & API
- **Supabase Client**: Import from `@/integrations/supabase/client`
- **Helper Functions**: Use `src/lib/supabase-helpers.ts` for common DB operations
- **Error Handling**: Wrap Supabase calls with try/catch; use error boundary in App.tsx
- **Realtime**: Use Supabase subscriptions for live updates (not implemented yet, but structure is ready)

#### TypeScript
- **Paths**: Use `@/` alias for src-relative imports (configured in tsconfig.json)
- **Relaxed Typing**: `strictNullChecks: false`, `noImplicitAny: false` for developer velocity
- **Generated Types**: Supabase types in `src/integrations/supabase/types.ts` (auto-generated via Supabase CLI)

#### Styling
- **Tailwind CSS**: Primary styling utility
- **CSS Modules**: Not used (Tailwind handles scoping)
- **Theme**: Supports dark mode via Next Themes integration
- **UI Library**: shadcn/ui for component primitives (Dialog, Sheet, Tabs, etc.)

#### State Management
- **React Query**: Used for server state (API calls, statements, user data)
- **Local State**: useState for component-level UI state
- **Context**: Minimal use; Clerk handles auth context

#### PDF Processing
- **Client-Side**: Parsing happens in browser (no server overhead)
- **Output**: `ParsedTransaction[]` with standardized fields (date, amount, type, category)
- **Supported Formats**: MTN MoMo & Airtel Money statements (format-specific parsing in pdfParser.ts)

#### Environment Variables
- **Location**: `.env.local` (never commit)
- **Required Keys**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`
- **Vite Prefix**: Variables must start with `VITE_` to be exposed to client code

#### Git Workflow
- Create feature branches: `git checkout -b feature/your-feature`
- Follow conventional commits for clarity
- PRs reviewed before merge to main

## Testing Notes

- Tests use `jsdom` environment (no real browser needed)
- Import setup: `@testing-library/react`, `@testing-library/jest-dom`
- Example test in `src/test/example.test.ts`
- Vitest configuration in `vitest.config.ts` (globals enabled, so no import needed)

## Development Tips

- **Hot Module Replacement (HMR)**: Vite's HMR overlay is disabled in dev config for cleaner UX
- **Lovable Tagger**: Development-only plugin for component tagging/organization
- **Admin Access**: Test via Supabase role management (edit user role in DB)
- **Maintenance Mode**: AdminSettings component can toggle global maintenance (checks `is_maintenance_mode` in Supabase)
- **Responsive**: Use `useIsMobile()` hook from `src/hooks/use-mobile.tsx` for mobile-specific logic
