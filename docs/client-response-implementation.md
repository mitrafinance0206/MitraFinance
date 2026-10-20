# RDK client response implementation

Source: the seven-page scanned `response sheet.pdf` provided on 25 September 2026. The form's questions are context; its filled responses define the requested website content.

## Implemented

- RDK Financial Services branding, Avinashi/Tirupur office address, phone 7373346937, email rdkfs22@gmail.com and supplied social handle.
- About content based on the client's stated tie-ups with over 100 banks and NBFCs. No invented lender logos, customer ratings, disbursal figures, regulated status or guaranteed approval timelines.
- Personal loan, home loan, loan against property and OD/CC. Removed other products from the live public pages.
- Personal loan enquiries require bank-credited monthly salary strictly above INR 20,000. Home/property enquiries accept bank salary, cash salary, self-employed and business applicants. Property LTV above 70% is described as subject to lender assessment and valuation.
- Public landing and enquiry pages in Tamil and English. Language preference persists in the browser. Existing staff dashboards remain in English.
- All selected enquiry fields, including gender and existing loans, with shared server/browser validation. Identity numbers are masked in review and excluded from WhatsApp URLs. No OTP service added.
- Reducing-balance and flat-rate EMI estimation, zero-rate handling and up to 25 years. Rates are editable illustrations; unspecified fees are excluded and clearly explained. OD/CC facility repayment terms are distinguished from EMI estimates.
- Customer-controlled WhatsApp handoff to the supplied phone. No automatic messages are sent. Stored enquiries have a reference; failed saves retain the form and offer a clearly labelled basic WhatsApp fallback without claiming that full details were saved.
- Existing staff access retained. Gender, existing loan details and accepted consent are stored as labelled lines in the existing `remarks` column, which authorised staff can read. No database migration is needed for these extra fields.
- API validation, bounded payloads, UUID-based retry references, duplicate-submit prevention, loading/error states and no false success after storage failure.

## Outstanding external inputs

- The PDF contains a logo upload filename, not the image. A text wordmark and matching text favicon are used until the actual logo is supplied.
- The existing Supabase project hostname returned `ENOTFOUND` during the read-only connectivity check. Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` to enable verified database storage and existing staff authentication. Never commit secrets. After updating, perform an authorised test enquiry against that database.
- The supplied social handle does not identify a platform, so it is displayed as text rather than linked to an assumed account.
- No rates, processing charges, amount limits, detailed document checklist or legal policy were filled in. No policies from the unrelated Gokul document are published.
- WhatsApp Business API credentials/provider details were not supplied. Current WhatsApp contact is a click-to-chat handoff; automatic business notifications require a separate configured integration.

## Verification

- `npm test`: financial calculations, valid/invalid enquiries, supported products, salary threshold, normalization and WhatsApp encoding.
- `npm run typecheck` and `npm run build`: full project type validation and production compilation (type errors are no longer ignored).
- `tests/e2e/rdk.cjs`: Chrome desktop/mobile rendering, English/Tamil switch, overflow, navigation, calculator updates, application validation, masked review, simulated API failure/retry/success, and WhatsApp link contents. Successful writes are mocked; no personal data or WhatsApp messages are sent.
- Browser accessibility checks use axe WCAG A/AA rules. Screenshots and tool dependencies are kept under ignored `tmp/`.

Run the browser suite after starting the site on port 3000:

```sh
npm install --prefix tmp/test-tools --no-package-lock playwright @axe-core/playwright
node tests/e2e/rdk.cjs
```
