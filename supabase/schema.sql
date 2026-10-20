-- ============================================================
-- FinServe Capital — Role-Based Auth Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create the user_role enum
CREATE TYPE user_role AS ENUM ('admin', 'loan_officer', 'borrower', 'servicing_agent');

-- 2. Users table (mirrors auth.users, stores role)
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  role        user_role NOT NULL DEFAULT 'borrower',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. Auto-insert into public.users when a new auth user is created
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'borrower')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

-- ============================================================
-- 5. Row Level Security
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role without recursion
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Policy: users can always read their own row
CREATE POLICY "users_read_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Policy: admins can read all users
CREATE POLICY "admin_read_all_users"
  ON public.users FOR SELECT
  USING (get_my_role() = 'admin');

-- Policy: admins can update any user (role changes, etc.)
CREATE POLICY "admin_update_all_users"
  ON public.users FOR UPDATE
  USING (get_my_role() = 'admin');

-- Policy: admins can delete users
CREATE POLICY "admin_delete_users"
  ON public.users FOR DELETE
  USING (get_my_role() = 'admin');

-- Policy: loan officers can read borrowers
-- (extend this later with a loan_officer_id FK on users if needed)
CREATE POLICY "loan_officer_read_borrowers"
  ON public.users FOR SELECT
  USING (
    get_my_role() = 'loan_officer'
    AND role = 'borrower'
  );

-- Policy: users can update their own non-role fields
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- prevent self-role-escalation
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
  );

-- ============================================================
-- 6. Seed an initial admin (replace with your real Supabase auth UID)
-- Run AFTER creating the user through Supabase Auth (signup or dashboard)
-- ============================================================
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@finserve.com';
