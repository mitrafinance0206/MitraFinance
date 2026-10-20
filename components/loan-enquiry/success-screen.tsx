"use client"

import { CheckCircle2, Clock, Phone, Mail, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

const META = [
  { icon: Clock,  label: "Response time",     value: "Within 1 business day" },
  { icon: Phone,  label: "Phone call",         value: "From a loan advisor"   },
  { icon: Mail,   label: "Email confirmation", value: "Sent to your inbox"    },
]

export function SuccessScreen({
  referenceId,
  onReset,
  email,
}: {
  referenceId: string
  onReset: () => void
  email?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center sm:p-12">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="size-9 text-success" aria-hidden="true" />
      </div>

      <h2 className="mt-5 text-xl font-medium text-foreground">Enquiry received</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
        Thank you for applying with RDK Financial Services. Your enquiry has been logged and a loan
        advisor will review your details shortly.
      </p>

      {/* Reference ID */}
      <div className="mx-auto mt-6 max-w-xs rounded-lg border border-border bg-muted px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Reference ID</p>
        <p className="mt-1 font-mono text-lg font-medium text-primary">{referenceId}</p>
      </div>

      {/* Next steps */}
      <div className="mx-auto mt-8 grid max-w-lg gap-4 sm:grid-cols-3">
        {META.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Track your application — sign up / sign in */}
      <div className="mx-auto mt-8 max-w-md rounded-xl border border-accent/30 bg-accent/5 p-5 text-left">
        <div className="flex items-start gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 shrink-0">
            <UserPlus className="size-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Track your application</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Create a free account{email ? <> using <strong>{email}</strong></> : ""} to log in
              and check the live status of your loan anytime.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link
            href={email ? `/register?email=${encodeURIComponent(email)}` : "/register"}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="size-4" />
            Create account
          </Link>
          <Link
            href="/login"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <LogIn className="size-4" />
            Sign in
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Submit another enquiry
      </button>
    </div>
  )
}
