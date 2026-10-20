-- ============================================================
-- Migration 0003 — RLS policies
-- ============================================================

-- Helper: get current user role without recursion
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── users table ───────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admin_read_all_users"
  ON public.users FOR SELECT
  USING (get_my_role() = 'admin');

CREATE POLICY "admin_update_all_users"
  ON public.users FOR UPDATE
  USING (get_my_role() = 'admin');

CREATE POLICY "admin_delete_users"
  ON public.users FOR DELETE
  USING (get_my_role() = 'admin');

CREATE POLICY "loan_officer_read_borrowers"
  ON public.users FOR SELECT
  USING (get_my_role() = 'loan_officer' AND role = 'borrower');

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
  );

-- ── loan_enquiries table ──────────────────────────────────────
ALTER TABLE public.loan_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_submit"
  ON public.loan_enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "staff_read_all"
  ON public.loan_enquiries FOR SELECT
  USING (get_my_role() IN ('admin', 'loan_officer', 'servicing_agent'));

CREATE POLICY "staff_update_status"
  ON public.loan_enquiries FOR UPDATE
  USING (get_my_role() IN ('admin', 'loan_officer'));
