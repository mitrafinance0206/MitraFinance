import { Landmark, Lock, Phone } from "lucide-react"

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Landmark className="size-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-medium text-foreground">RDK Financial Services</p>
            <p className="text-xs text-muted-foreground">Loan solutions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+917373346937"
            className="hidden items-center gap-1.5 text-sm text-foreground sm:flex"
          >
            <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
            <span>+91 73733 46937</span>
          </a>
          <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            <Lock className="size-3.5" aria-hidden="true" />
            SSL secured
          </span>
        </div>
      </div>
    </header>
  )
}
