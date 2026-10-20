# Database Schema

Supabase project: `ehixoiycuzyjtnivhlxd`

## Tables

### `public.users`

| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | References `auth.users(id)` |
| email | TEXT UNIQUE | |
| full_name | TEXT | |
| role | user_role | `admin` / `loan_officer` / `borrower` / `servicing_agent` |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

### `public.loan_enquiries`

| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | `gen_random_uuid()` |
| reference_id | TEXT UNIQUE | e.g. `LNQ-821713` |
| loan_type | TEXT | home / personal / business / vehicle / education / gold |
| full_name | TEXT | |
| dob | TEXT | |
| mobile | TEXT | |
| email | TEXT | |
| pan | TEXT | |
| aadhaar | TEXT | |
| address | TEXT | |
| employment_type | TEXT | |
| organisation | TEXT | |
| monthly_income | NUMERIC | |
| existing_emis | NUMERIC | |
| loan_amount | NUMERIC | |
| tenure | TEXT | |
| purpose | TEXT | |
| remarks | TEXT | |
| status | TEXT | pending / reviewing / approved / rejected / disbursed |
| created_at | TIMESTAMPTZ | |

## Migrations

Run in order in Supabase SQL Editor:

1. `supabase/migrations/0001_init_schema.sql`
2. `supabase/migrations/0002_fix_trigger.sql`
3. `supabase/migrations/0003_rls_policies.sql`
4. `supabase/seed.sql` (demo data, optional)

## Triggers

- `users_updated_at` — sets `updated_at = NOW()` before every UPDATE on `public.users`
- `on_auth_user_created` — auto-inserts a row in `public.users` when Supabase Auth creates a user

## Helper Functions

- `update_updated_at()` — trigger function for timestamp
- `handle_new_auth_user()` — trigger function for user sync
- `get_my_role()` — returns the current user's role without causing RLS recursion
