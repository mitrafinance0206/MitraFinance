-- ============================================================
-- Migration 0004 — Borrower can read their own loan enquiries
-- ============================================================

-- Allow borrowers to SELECT their own enquiries (matched by email)
CREATE POLICY "borrower_read_own_enquiries"
  ON public.loan_enquiries FOR SELECT
  USING (
    lower(email) = lower((
      SELECT email FROM public.users WHERE id = auth.uid()
    ))
  );
