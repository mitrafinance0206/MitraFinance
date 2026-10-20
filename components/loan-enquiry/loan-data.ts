/**
 * Backwards-compat barrel — re-exports from the new canonical location.
 * Prefer importing directly in new code:
 *   import { LOAN_TYPES, LOAN_DOCUMENTS } from "@/lib/loans/constants"
 */
export {
  LOAN_TYPES,
  LOAN_DOCUMENTS,
  EMPLOYMENT_TYPES,
  TENURES,
  PURPOSES,
} from "@/lib/loans/constants"

export type { DocumentCategory } from "@/lib/loans/constants"
