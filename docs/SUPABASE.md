# Supabase Reference

This document describes the Supabase tables referenced by the MoMoSense Insights client code, how each table is used, RLS requirements, and how to work with the generated TypeScript types.

---

## Project Setup

The Supabase client is initialised in `src/integrations/supabase/client.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

The `Database` generic provides full TypeScript type safety across all queries.

---

## Tables

### `profiles`

Stores user-level metadata, plan information, and usage counters.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Row UUID |
| `user_id` | `text` | Clerk user ID |
| `email` | `text` | User email address |
| `full_name` | `text` | Display name |
| `plan` | `text` | Current plan: `free`, `starter`, `pro`, `business`, `enterprise` |
| `pages_used_today` | `int` | Pages parsed today |
| `pages_used_month` | `int` | Pages parsed this month |
| `pages_limit_month` | `int` | Monthly page cap for current plan |
| `last_reset_date` | `timestamp` | Date daily counter was last reset |
| `is_banned` | `bool` | Whether the user is banned |
| `banned_at` | `timestamp` | When the ban was applied |
| `ban_reason` | `text` | Reason for ban |
| `created_at` | `timestamp` | Account creation time |

**Used by:** `getOrCreateProfile()`, `checkPageLimit()`, `incrementPageCount()` in `src/lib/supabase-helpers.ts`.

---

### `statements`

Top-level record for each uploaded PDF statement.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Statement UUID |
| `user_id` | `text` | Owning user (Clerk ID) |
| `provider` | `text` | `mtn` or `airtel` |
| `account_name` | `text` | Account holder name from PDF |
| `date_from` | `text` | Statement start date |
| `date_to` | `text` | Statement end date |
| `total_in` | `numeric` | Total money received |
| `total_out` | `numeric` | Total money sent |
| `total_fees` | `numeric` | Total fees charged |
| `total_taxes` | `numeric` | Total taxes charged |
| `net_balance` | `numeric` | Net balance change |
| `total_transactions` | `int` | Number of transactions |
| `total_pages` | `int` | Number of PDF pages parsed |
| `uploaded_at` | `timestamp` | Upload timestamp |

**Used by:** `saveStatementToSupabase()`, `fetchRecentStatements()`, `fetchFullStatement()` in `src/lib/supabase-helpers.ts`.

---

### `transactions`

Individual transactions extracted from a statement.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Transaction UUID |
| `statement_id` | `uuid` (FK → statements) | Parent statement |
| `user_id` | `text` | Owning user (Clerk ID) |
| `date` | `text` | Transaction date |
| `time` | `text` | Transaction time |
| `description` | `text` | Transaction description / party name |
| `transaction_type` | `text` | e.g. `Incoming`, `Outgoing`, `Transfer` |
| `direction` | `text` | `in` or `out` |
| `amount` | `numeric` | Transaction amount |
| `fees` | `numeric` | Fee charged |
| `taxes` | `numeric` | Tax charged |
| `running_balance` | `numeric` | Balance after transaction |
| `category` | `text` | Auto-categorised label (Airtime, Food, Utilities, etc.) |
| `transaction_id_ref` | `text` | Original transaction reference from PDF |
| `created_at` | `timestamp` | Row creation time |

**Used by:** `saveStatementToSupabase()`, `fetchStatementTransactions()`, `fetchFullStatement()`.

---

### `insights`

AI-generated text insights for a statement.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Insight UUID |
| `statement_id` | `uuid` (FK → statements) | Parent statement |
| `user_id` | `text` | Owning user (Clerk ID) |
| `insight_text` | `text` | The generated insight content |
| `generated_at` | `timestamp` | When the insight was generated |

**Used by:** `saveStatementToSupabase()`, `fetchStatementInsights()`, `fetchFullStatement()`.

---

### `payment_requests`

Records of manual payment submissions (MoMo transaction IDs) for plan upgrades.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Request UUID |
| `user_id` | `text` | Requesting user (Clerk ID) |
| `email` | `text` | User email |
| `plan` | `text` | Plan being purchased |
| `amount_ugx` | `int` | Amount paid in UGX |
| `momo_transaction_id` | `text` | MoMo transaction reference |
| `network` | `text` | `mtn` or `airtel` |
| `status` | `text` | `pending`, `approved`, `rejected` |
| `submitted_at` | `timestamp` | Submission time |
| `verified_at` | `timestamp` | Admin verification time |

**Used by:** admin functions in `src/lib/admin-helpers.ts` (`fetchAllPaymentRequests()`, `activatePayment()`, `rejectPayment()`).

---

### `admin_settings`

Key-value store for application-wide admin configuration.

| Column | Type | Description |
|---|---|---|
| `key` | `text` (PK) | Setting key |
| `value` | `text` | Setting value |
| `updated_at` | `timestamp` | Last update time |

**Used by:** `fetchAdminSettings()`, `updateAdminSetting()` in `src/lib/admin-helpers.ts`.

---

## Row Level Security (RLS)

> **RLS must be enabled and correctly configured on all tables.** Without RLS, any authenticated user could read or modify another user's data.

Recommended policy patterns:

```sql
-- profiles: users can only read/write their own row
CREATE POLICY "Users can manage own profile"
  ON profiles
  USING (user_id = auth.uid()::text);

-- statements: users can only access their own statements
CREATE POLICY "Users can manage own statements"
  ON statements
  USING (user_id = auth.uid()::text);

-- transactions: users can only access transactions linked to their statements
CREATE POLICY "Users can manage own transactions"
  ON transactions
  USING (user_id = auth.uid()::text);

-- insights: users can only access their own insights
CREATE POLICY "Users can manage own insights"
  ON insights
  USING (user_id = auth.uid()::text);
```

Admin operations (via `src/lib/admin-helpers.ts`) should use a separate service-role key kept **server-side only** or be protected by an additional `is_admin` check.

---

## Generated TypeScript Types

The file `src/integrations/supabase/types.ts` contains auto-generated types for the entire database schema. These are referenced by `createClient<Database>()` for type-safe queries.

To regenerate after schema changes:

```bash
npx supabase gen types typescript \
  --project-id <your-project-ref> \
  > src/integrations/supabase/types.ts
```

Or using the Supabase CLI if linked locally:

```bash
supabase db pull
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

Commit the updated `types.ts` whenever the database schema changes.
