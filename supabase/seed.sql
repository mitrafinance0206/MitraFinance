-- ============================================================
-- Seed — demo users (run AFTER migrations)
-- Password for all accounts: Demo@1234
-- ============================================================

-- Reset passwords for existing demo users
UPDATE auth.users
SET encrypted_password = crypt('Demo@1234', gen_salt('bf'))
WHERE email IN (
  'admin@finserve.com',
  'officer@finserve.com',
  'borrower@finserve.com',
  'agent@finserve.com'
);

-- Insert missing users (skip if already present)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'admin@finserve.com', crypt('Demo@1234', gen_salt('bf')),
  NOW(), '{"full_name":"Admin User"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@finserve.com');

INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'officer@finserve.com', crypt('Demo@1234', gen_salt('bf')),
  NOW(), '{"full_name":"Ravi Kumar"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'officer@finserve.com');

INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'borrower@finserve.com', crypt('Demo@1234', gen_salt('bf')),
  NOW(), '{"full_name":"Arjun Sharma"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'borrower@finserve.com');

INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, role, aud, created_at, updated_at
)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'agent@finserve.com', crypt('Demo@1234', gen_salt('bf')),
  NOW(), '{"full_name":"Sunita Rao"}'::jsonb,
  'authenticated', 'authenticated', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'agent@finserve.com');

-- Assign correct roles
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
UPDATE public.users SET role = 'admin',           full_name = 'Admin User'   WHERE email = 'admin@finserve.com';
UPDATE public.users SET role = 'loan_officer',    full_name = 'Ravi Kumar'   WHERE email = 'officer@finserve.com';
UPDATE public.users SET role = 'borrower',        full_name = 'Arjun Sharma' WHERE email = 'borrower@finserve.com';
UPDATE public.users SET role = 'servicing_agent', full_name = 'Sunita Rao'   WHERE email = 'agent@finserve.com';
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT email, full_name, role FROM public.users ORDER BY created_at;
