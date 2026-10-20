"use client"

import { useEffect, useRef } from "react"
import { X, FileText, CheckCircle2, MapPin } from "lucide-react"
import { LOAN_DOCUMENTS, LOAN_TYPES } from "@/lib/loans/constants"

interface DocumentsModalProps {
  loanId: string
  onClose: () => void
  onApply?: () => void
}

export function DocumentsModal({ loanId, onClose, onApply }: DocumentsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const loan = LOAN_TYPES.find((l) => l.id === loanId)
  const docs = LOAN_DOCUMENTS[loanId]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  if (!loan || !docs) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
      aria-modal="true"
      role="dialog"
      aria-label={`${loan.name} — Required Documents`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full sm:max-w-2xl max-h-[90dvh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-background shadow-2xl outline-none overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border bg-primary text-primary-foreground shrink-0">
          <div className="flex items-center gap-3">
            <loan.icon className="size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-base font-semibold leading-tight">
                {loan.name} — Required Documents
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="size-3 text-primary-foreground/70" aria-hidden="true" />
                <p className="text-xs text-primary-foreground/70">Tamil Nadu — Bank Guidelines</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 hover:bg-primary-foreground/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Notice banner */}
        <div className="mx-5 mt-4 mb-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 shrink-0">
          <FileText className="size-4 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-800 leading-relaxed">
            The following documents are commonly required by banks and NBFCs in Tamil Nadu. Minor variations may apply depending on the lender.
          </p>
        </div>

        {/* Document categories — scrollable */}
        <div className="overflow-y-auto flex-1 px-5 pb-5 space-y-4">
          {docs.map((cat, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-2.5 bg-accent/10 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{cat.category}</h3>
              </div>
              <ul className="divide-y divide-border">
                {cat.docs.map((doc, j) => (
                  <li key={j} className="flex items-start gap-3 px-4 py-3">
                    <CheckCircle2 className="size-4 shrink-0 text-green-500 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-foreground leading-relaxed">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-4 flex gap-3 bg-background">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
          {onApply && (
            <button
              onClick={() => { onClose(); onApply() }}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
