-- ============================================================
-- Seed all 4 demo users
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create users in auth.users with hashed password "Demo@1234"
-- Then set their roles in public.users

-- 1. Admin
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
) VALUES (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'admin@finserve.com',
  crypt('Demo@1234', gen_salt('bf')),
  NOW(),
  '{"full_name":"Admin User"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Loan Officer
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
) VALUES (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'officer@finserve.com',
  crypt('Demo@1234', gen_salt('bf')),
  NOW(),
  '{"full_name":"Ravi Kumar"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. Borrower
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
) VALUES (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'borrower@finserve.com',
  crypt('Demo@1234', gen_salt('bf')),
  NOW(),
  '{"full_name":"Arjun Sharma"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- 4. Servicing Agent
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
) VALUES (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'agent@finserve.com',
  crypt('Demo@1234', gen_salt('bf')),
  NOW(),
  '{"full_name":"Sunita Rao"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Now assign correct roles in public.users
-- (trigger already created borrower role for all, just update)
-- ============================================================

UPDATE public.users SET role = 'admin',           full_name = 'Admin User'  WHERE email = 'admin@finserve.com';
UPDATE public.users SET role = 'loan_officer',    full_name = 'Ravi Kumar'  WHERE email = 'officer@finserve.com';
UPDATE public.users SET role = 'borrower',        full_name = 'Arjun Sharma' WHERE email = 'borrower@finserve.com';
UPDATE public.users SET role = 'servicing_agent', full_name = 'Sunita Rao'  WHERE email = 'agent@finserve.com';

-- ============================================================
-- Verify — should show all 4 users with correct roles
-- ============================================================
SELECT email, full_name, role FROM public.users ORDER BY created_at;
