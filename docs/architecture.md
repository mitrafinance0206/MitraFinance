# Architecture

## Overview

FinServe Capital is a **Next.js 16 App Router** application with **Supabase** as the backend.

```
Browser → Next.js (Vercel/Node) → Supabase (PostgreSQL + Auth)
```

## Folder Structure

```
app/            Next.js routes — thin pages, delegate logic to components/hooks/lib
(auth)/         Route group: /login, /register — shared auth shell layout
(public)/       Route group: /apply — public loan application
dashboard/      Protected role-based dashboards
api/            Server Route Handlers

components/     UI building blocks — no business logic, no direct DB calls
hooks/          Reusable client-side logic (useAuth, useRolePermissions, etc.)
lib/            Pure logic — auth actions, loan API calls, Supabase clients, constants
types/          Canonical TypeScript interfaces (UserProfile, LoanEnquiry)
context/        React context (AuthProvider)
supabase/       SQL migrations + seed
```

## Data Flow

1. **User submits loan form** → `loan-enquiry-form.tsx` calls `saveLoanEnquiry()` from `lib/loans/api.ts`
2. **Auth** → Supabase Auth JWT stored in cookies, refreshed by `proxy.ts` on every request
3. **Role protection** → `proxy.ts` reads role from `public.users`, redirects if unauthorised
4. **Dashboard data** → Server Components fetch directly via `createServerSupabaseClient()`
5. **Client interactivity** → Client Components use hooks (`useLoanEnquiries`, `useRolePermissions`)

## Auth Flow

```
/login → LoginForm → signIn() → fetch profile → redirect to role dashboard
/register → RegisterForm → signUp() → email confirm → /login
```

## Route Protection

`proxy.ts` (Next.js middleware) handles three cases:
- Unauthenticated user visits `/dashboard/*` → redirect `/login`
- Authenticated user visits `/login` or `/register` → redirect `/dashboard`
- Authenticated user visits wrong role route → redirect `/dashboard` (smart router picks correct one)
