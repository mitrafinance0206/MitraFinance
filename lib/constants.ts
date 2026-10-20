// App-wide constants

export const APP_NAME = "RDK Financial Services"
export const APP_TAGLINE = "Loan solutions"
export const SUPPORT_PHONE = "+91 73733 46937"
export const SUPPORT_EMAIL = "rdkfs22@gmail.com"

// Loan status display map
export const LOAN_STATUS_LABELS: Record<string, string> = {
  pending:   "Pending",
  reviewing: "Under Review",
  approved:  "Approved",
  rejected:  "Rejected",
  disbursed: "Disbursed",
}

export const LOAN_STATUS_VARIANTS: Record<string, "default" | "info" | "success" | "warning" | "danger"> = {
  pending:   "warning",
  reviewing: "info",
  approved:  "success",
  rejected:  "danger",
  disbursed: "success",
}

// Role → dashboard route map (also in lib/auth/permissions, kept here for convenience)
export const ROLE_ROUTES: Record<string, string> = {
  admin:            "/dashboard/admin",
  loan_officer:     "/dashboard/officer",
  borrower:         "/dashboard/client",
  servicing_agent:  "/dashboard/servicing",
}

// Loan type display labels
export const LOAN_TYPE_LABELS: Record<string, string> = {
  personal: "Personal Loan",
  home: "Home Loan",
  property: "Loan Against Property",
  od_cc: "Overdraft / Cash Credit",
  business: "Business Loan (legacy)",
  vehicle: "Vehicle Loan (legacy)",
  education: "Education Loan (legacy)",
  gold: "Gold Loan (legacy)",
}
