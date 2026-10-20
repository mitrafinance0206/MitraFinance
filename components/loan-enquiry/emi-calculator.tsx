"use client"

import { useMemo, useState } from "react"
import { Calculator, TrendingUp, IndianRupee, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Default interest rates by loan type
const INTEREST_RATES: Record<string, number> = {
  home:      8.5,
  personal:  12.0,
  business:  14.0,
  vehicle:   9.5,
  education: 9.0,
  gold:      7.5,
  "":        10.0,
}

function calcEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0 || annualRate <= 0) return 0
  const r = annualRate / 12 / 100
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1)
}

function tenureToMonths(tenure: string): number {
  if (!tenure) return 0
  const [val, unit] = tenure.split(" ")
  const n = parseInt(val, 10)
  if (unit?.startsWith("month")) return n
  if (unit?.startsWith("year"))  return n * 12
  return 0
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

// Thin progress bar segment
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      className={cn("h-full rounded-full transition-all duration-500", color)}
      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
    />
  )
}

interface Props {
  loanType: string
  loanAmount: string   // raw digits string from the form
  tenure: string       // e.g. "20 years"
}

export function EmiCalculator({ loanType, loanAmount, tenure }: Props) {
  const [open, setOpen] = useState(true)
  const [customRate, setCustomRate] = useState("")

  const defaultRate = INTEREST_RATES[loanType] ?? 10
  const rate = customRate ? parseFloat(customRate) : defaultRate
  const principal = parseInt(loanAmount || "0", 10)
  const months = tenureToMonths(tenure)

  const emi          = useMemo(() => calcEMI(principal, rate, months), [principal, rate, months])
  const totalPayable = emi * months
  const totalInterest = totalPayable - principal
  const principalPct  = totalPayable > 0 ? (principal / totalPayable) * 100 : 0
  const interestPct   = 100 - principalPct

  const hasValues = principal > 0 && months > 0

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="size-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">EMI Calculator</p>
            <p className="text-xs text-muted-foreground">
              {hasValues
                ? `₹${formatINR(emi)} / month estimated`
                : "Fill loan amount & tenure to see your EMI"}
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp  className="size-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        }
      </button>

      {open && (
        <div className="border-t border-border">
          {/* Interest rate row */}
          <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Interest rate for{" "}
                <span className="font-medium text-foreground capitalize">
                  {loanType || "selected loan"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="36"
                step="0.1"
                value={customRate || defaultRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-20 rounded-lg border border-input bg-background px-2.5 py-1.5 text-center text-sm font-medium text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                aria-label="Annual interest rate"
              />
              <span className="text-sm text-muted-foreground">% p.a.</span>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 px-5 py-4">
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Monthly EMI</p>
              <p className={cn(
                "text-lg font-bold tabular-nums",
                hasValues ? "text-primary" : "text-muted-foreground"
              )}>
                {hasValues ? `₹${formatINR(emi)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
              <p className={cn(
                "text-lg font-bold tabular-nums",
                hasValues ? "text-amber-600" : "text-muted-foreground"
              )}>
                {hasValues ? `₹${formatINR(totalInterest)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Payable</p>
              <p className={cn(
                "text-lg font-bold tabular-nums",
                hasValues ? "text-foreground" : "text-muted-foreground"
              )}>
                {hasValues ? `₹${formatINR(totalPayable)}` : "—"}
              </p>
            </div>
          </div>

          {/* Breakdown bar */}
          {hasValues && (
            <div className="px-5 pb-5 space-y-3">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-border gap-0.5">
                <Bar pct={principalPct}  color="bg-primary" />
                <Bar pct={interestPct}   color="bg-amber-400" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block size-2.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    Principal{" "}
                    <span className="font-medium text-foreground">
                      ₹{formatINR(principal)} ({principalPct.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block size-2.5 rounded-full bg-amber-400" />
                  <span className="text-muted-foreground">
                    Interest{" "}
                    <span className="font-medium text-foreground">
                      ₹{formatINR(totalInterest)} ({interestPct.toFixed(1)}%)
                    </span>
                  </span>
                </div>
              </div>

              {/* Amortisation hint */}
              <p className="text-xs text-muted-foreground border-t border-border pt-3">
                <IndianRupee className="inline size-3 mr-0.5" />
                Based on a reducing balance method at <strong>{rate}% p.a.</strong> over{" "}
                <strong>{months} months</strong>. Actual rate may vary by lender.
              </p>
            </div>
          )}

          {/* Prompt when values are missing */}
          {!hasValues && (
            <div className="px-5 pb-5">
              <p className="text-xs text-center text-muted-foreground py-3 border border-dashed border-border rounded-xl">
                Enter loan amount and select tenure above to see the breakdown.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
