-- ============================================================
-- Migration 0001 — Initial schema
-- ============================================================

-- 1. user_role enum
CREATE TYPE user_role AS ENUM ('admin', 'loan_officer', 'borrower', 'servicing_agent');

-- 2. users table
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  role        user_role NOT NULL DEFAULT 'borrower',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Auto-update updated_at
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

-- 4. loan_enquiries table
CREATE TABLE public.loan_enquiries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id      TEXT UNIQUE NOT NULL,
  loan_type         TEXT NOT NULL,
  full_name         TEXT NOT NULL,
  dob               TEXT,
  mobile            TEXT NOT NULL,
  email             TEXT NOT NULL,
  pan               TEXT,
  aadhaar           TEXT,
  address           TEXT,
  employment_type   TEXT,
  organisation      TEXT,
  monthly_income    NUMERIC,
  existing_emis     NUMERIC,
  loan_amount       NUMERIC NOT NULL,
  tenure            TEXT,
  purpose           TEXT,
  remarks           TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
