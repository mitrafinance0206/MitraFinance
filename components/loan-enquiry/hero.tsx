import { Clock, ShieldCheck, BadgeCheck, Star } from "lucide-react"

const TRUST_SIGNALS = [
  { icon: Clock, label: "5-min application" },
  { icon: ShieldCheck, label: "100% data privacy" },
  { icon: BadgeCheck, label: "RBI regulated" },
  { icon: Star, label: "4.8/5 customer rating" },
]

export function Hero({ progress }: { progress: number }) {
  return (
    <section>
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <h1 className="text-2xl font-medium sm:text-3xl text-balance">Apply for a loan</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/80 text-pretty">
            Get a quick decision on the funding you need. Complete the form below and our team will
            reach out within one business day.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[3px] w-full bg-border" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  )
}
