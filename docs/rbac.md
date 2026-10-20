# Role-Based Access Control (RBAC)

## Roles

| Role | Description |
|---|---|
| `admin` | Full access — manages users, all loans, reports, platform settings |
| `loan_officer` | Onboards borrowers, creates and tracks loan applications |
| `borrower` | Views only their own loans, payments, and profile |
| `servicing_agent` | Handles EMI verification, NOC, statements — read-only on loans |

## Permissions

Defined in `lib/auth/permissions.ts`.

| Permission | admin | loan_officer | borrower | servicing_agent |
|---|---|---|---|---|
| users:read | ✅ | ❌ | ❌ | ❌ |
| users:write | ✅ | ❌ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ | ❌ |
| loans:read | ✅ | ✅ | ❌ | ✅ |
| loans:write | ✅ | ✅ | ❌ | ❌ |
| loans:delete | ✅ | ❌ | ❌ | ❌ |
| payments:read | ✅ | ✅ | ❌ | ✅ |
| payments:write | ✅ | ❌ | ❌ | ✅ |
| reports:read | ✅ | ❌ | ❌ | ❌ |
| own_loans:read | ❌ | ❌ | ✅ | ❌ |
| own_payments:read | ❌ | ❌ | ✅ | ❌ |
| own_profile:read | ❌ | ❌ | ✅ | ❌ |
| own_profile:write | ❌ | ❌ | ✅ | ❌ |
| servicing:read | ❌ | ❌ | ❌ | ✅ |
| servicing:write | ❌ | ❌ | ❌ | ✅ |

## Enforcement Layers

### 1. Middleware (`proxy.ts`)
Route-level guard — checks role before the page renders.

### 2. Server Components
Each dashboard page independently verifies role via `createServerSupabaseClient()`.

### 3. Database (RLS)
Row Level Security on `public.users` and `public.loan_enquiries` — enforced even if app-level checks are bypassed.

### 4. Client (`useRolePermissions`)
UI elements shown/hidden based on `can("permission")` — purely cosmetic, not a security boundary.

## Checking Permissions in Components

```tsx
import { useRolePermissions } from "@/hooks/use-role-permissions"

export function SomeComponent() {
  const { can, is } = useRolePermissions()

  return (
    <>
      {can("users:write") && <ManageUsersButton />}
      {is("borrower") && <MyLoansPanel />}
    </>
  )
}
```

## Dashboard Routes

| Role | Route |
|---|---|
| admin | `/dashboard/admin` |
| loan_officer | `/dashboard/officer` |
| borrower | `/dashboard/client` |
| servicing_agent | `/dashboard/servicing` |
