import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Loan type", "Personal", "Employment", "Review"]

export function StepNavigator({ completed }: { completed: boolean[] }) {
  // active step = first not-completed step
  const activeIndex = completed.findIndex((c) => !c)

  return (
    <nav aria-label="Application progress" className="border-b border-border bg-card">
      <ol className="mx-auto flex max-w-5xl px-4 sm:px-6">
        {STEPS.map((label, i) => {
          const isComplete = completed[i]
          const isActive = i === activeIndex
          return (
            <li key={label} className="flex flex-1 items-center justify-center gap-2 py-3">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  isComplete && "bg-success text-success-foreground",
                  isActive && !isComplete && "bg-primary text-primary-foreground",
                  !isActive && !isComplete && "bg-muted text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  isComplete && "text-success",
                  isActive && !isComplete && "font-medium text-primary",
                  !isActive && !isComplete && "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
