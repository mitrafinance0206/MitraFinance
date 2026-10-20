"use client"

import { useMemo, useState } from "react"
import { Layers, IdCard, Wallet, Send, Info, FileText, ChevronDown, ChevronUp, CheckCircle2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { StepNavigator } from "./step-navigator"
import {
  SectionCard,
  CardHeader,
  FieldLabel,
  TextInput,
  TextArea,
  Select,
  FieldError,
} from "./fields"
import { LOAN_TYPES, EMPLOYMENT_TYPES, TENURES, PURPOSES, LOAN_DOCUMENTS } from "@/lib/loans/constants"
import { SuccessScreen } from "./success-screen"
import { EmiCalculator } from "./emi-calculator"
import { saveLoanEnquiry } from "@/lib/loans/api"

type FormState = {
  fullName: string
  dob: string
  mobile: string
  email: string
  pan: string
  aadhaar: string
  address: string
  employmentType: string
  organisation: string
  monthlyIncome: string
  existingEmis: string
  loanAmount: string
  tenure: string
  purpose: string
  remarks: string
}

const EMPTY: FormState = {
  fullName: "",
  dob: "",
  mobile: "",
  email: "",
  pan: "",
  aadhaar: "",
  address: "",
  employmentType: "",
  organisation: "",
  monthlyIncome: "",
  existingEmis: "",
  loanAmount: "",
  tenure: "",
  purpose: "",
  remarks: "",
}

const REQUIRED_FIELDS: (keyof FormState)[] = [
  "fullName",
  "dob",
  "mobile",
  "email",
  "pan",
  "aadhaar",
  "address",
  "employmentType",
  "organisation",
  "monthlyIncome",
  "loanAmount",
  "tenure",
  "purpose",
]

function formatINR(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  return new Intl.NumberFormat("en-IN").format(Number(digits))
}

function formatAadhaar(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 12)
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
}

export function LoanEnquiryForm() {
  const [loanType, setLoanType] = useState<string>("")
  const [form, setForm] = useState<FormState>(EMPTY)
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [loanTypeError, setLoanTypeError] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [docsOpen, setDocsOpen] = useState(false)

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }))
  }

  // live step completion tracking
  const completed = useMemo(() => {
    const step1 = Boolean(loanType)
    const step2 = Boolean(form.fullName && form.dob && form.mobile && form.email && form.pan && form.aadhaar && form.address)
    const step3 = Boolean(form.employmentType && form.organisation && form.monthlyIncome && form.loanAmount && form.tenure && form.purpose)
    const step4 = consent
    return [step1, step2, step3, step4]
  }, [loanType, form, consent])

  const progress = useMemo(() => {
    const done = completed.filter(Boolean).length
    return 10 + (done / completed.length) * 90
  }, [completed])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, boolean> = {}
    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = true
    })
    const noLoanType = !loanType
    const noConsent = !consent

    setErrors(nextErrors)
    setLoanTypeError(noLoanType)
    setConsentError(noConsent)

    if (Object.keys(nextErrors).length > 0 || noLoanType || noConsent) {
      const firstInvalid = document.querySelector("[data-invalid='true']")
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    const ref = "LNQ-" + Math.floor(100000 + Math.random() * 900000).toString()

    // 1. Save the loan enquiry
    try {
      await saveLoanEnquiry({
        referenceId:    ref,
        loanType:       loanType,
        fullName:       form.fullName,
        dob:            form.dob,
        mobile:         form.mobile,
        email:          form.email,
        pan:            form.pan,
        aadhaar:        form.aadhaar,
        address:        form.address,
        employmentType: form.employmentType,
        organisation:   form.organisation,
        monthlyIncome:  form.monthlyIncome,
        existingEmis:   form.existingEmis,
        loanAmount:     form.loanAmount,
        tenure:         form.tenure,
        purpose:        form.purpose,
        remarks:        form.remarks,
      })
    } catch (e) {
      console.error("Failed to save enquiry:", e)
    }

    setReferenceId(ref)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleReset = () => {
    setLoanType("")
    setForm(EMPTY)
    setConsent(false)
    setErrors({})
    setLoanTypeError(false)
    setConsentError(false)
    setSubmitted(false)
    setReferenceId("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14">
        <Hero progress={submitted ? 100 : progress} />
        {!submitted && <StepNavigator completed={completed} />}

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          {submitted ? (
            <SuccessScreen referenceId={referenceId} onReset={handleReset} email={form.email} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-6">
              {/* Section 1 — Loan type */}
              <SectionCard>
                <CardHeader
                  icon={<Layers className="size-5" aria-hidden="true" />}
                  title="Choose loan type"
                  subtitle="Select the product that best fits your need"
                />
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {LOAN_TYPES.map(({ id, name, limit, icon: Icon }) => {
                      const selected = loanType === id
                      return (
                        <button
                          type="button"
                          key={id}
                          onClick={() => {
                            setLoanType(id)
                            setLoanTypeError(false)
                            setDocsOpen(true)
                          }}
                          aria-pressed={selected}
                          className={cn(
                            "flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                            selected
                              ? "border-primary bg-accent/10"
                              : "border-border bg-card hover:border-accent/40",
                          )}
                        >
                          <Icon
                            className={cn("size-6", selected ? "text-primary" : "text-muted-foreground")}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-foreground">{name}</span>
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                            {limit}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {loanTypeError && (
                    <p className="mt-3 text-xs text-destructive" data-invalid="true">
                      Please select a loan type to continue.
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* Documents panel — shown when a loan type is selected */}
              {loanType && LOAN_DOCUMENTS[loanType] && (
                <SectionCard>
                  <button
                    type="button"
                    onClick={() => setDocsOpen((p) => !p)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted/50 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100">
                        <FileText className="size-4 text-amber-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Required Documents
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 text-muted-foreground" aria-hidden="true" />
                          <p className="text-xs text-muted-foreground">Tamil Nadu bank guidelines</p>
                        </div>
                      </div>
                    </div>
                    {docsOpen
                      ? <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                    }
                  </button>

                  {docsOpen && (
                    <div className="border-t border-border">
                      {/* Notice */}
                      <div className="mx-5 mt-4 mb-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                        <FileText className="size-4 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                          The following documents are commonly required by banks and NBFCs in Tamil Nadu. Minor variations may apply depending on the lender.
                        </p>
                      </div>

                      {/* Document categories */}
                      <div className="px-5 pb-5 space-y-4">
                        {LOAN_DOCUMENTS[loanType].map((cat, i) => (
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
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Section 2 — Personal information */}
              <SectionCard>
                <CardHeader
                  icon={<IdCard className="size-5" aria-hidden="true" />}
                  title="Personal information"
                  subtitle="Tell us a bit about yourself"
                />
                <div className="divide-y divide-border">
                  <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div data-invalid={errors.fullName || undefined}>
                      <FieldLabel htmlFor="fullName" required>Full name</FieldLabel>
                      <TextInput
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        placeholder="As per PAN card"
                        error={errors.fullName}
                      />
                      {errors.fullName && <FieldError message="Full name is required." />}
                    </div>
                    <div data-invalid={errors.dob || undefined}>
                      <FieldLabel htmlFor="dob" required>Date of birth</FieldLabel>
                      <TextInput
                        id="dob"
                        type="date"
                        value={form.dob}
                        onChange={(e) => set("dob", e.target.value)}
                        error={errors.dob}
                      />
                      {errors.dob && <FieldError message="Date of birth is required." />}
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div data-invalid={errors.mobile || undefined}>
                      <FieldLabel htmlFor="mobile" required>Mobile number</FieldLabel>
                      <TextInput
                        id="mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.mobile}
                        onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit number"
                        error={errors.mobile}
                      />
                      {errors.mobile && <FieldError message="Mobile number is required." />}
                    </div>
                    <div data-invalid={errors.email || undefined}>
                      <FieldLabel htmlFor="email" required>Email address</FieldLabel>
                      <TextInput
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@example.com"
                        error={errors.email}
                      />
                      {errors.email && <FieldError message="Email address is required." />}
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div data-invalid={errors.pan || undefined}>
                      <FieldLabel htmlFor="pan" required>PAN number</FieldLabel>
                      <TextInput
                        id="pan"
                        value={form.pan}
                        onChange={(e) => set("pan", e.target.value.toUpperCase().slice(0, 10))}
                        placeholder="ABCDE1234F"
                        error={errors.pan}
                      />
                      {errors.pan && <FieldError message="PAN number is required." />}
                    </div>
                    <div data-invalid={errors.aadhaar || undefined}>
                      <FieldLabel htmlFor="aadhaar" required>Aadhaar number</FieldLabel>
                      <TextInput
                        id="aadhaar"
                        inputMode="numeric"
                        value={form.aadhaar}
                        onChange={(e) => set("aadhaar", formatAadhaar(e.target.value))}
                        placeholder="XXXX XXXX XXXX"
                        error={errors.aadhaar}
                      />
                      {errors.aadhaar && <FieldError message="Aadhaar number is required." />}
                    </div>
                  </div>

                  <div className="p-5">
                    <div data-invalid={errors.address || undefined}>
                      <FieldLabel htmlFor="address" required>Residential address</FieldLabel>
                      <TextArea
                        id="address"
                        rows={3}
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="House / flat no., street, city, state, PIN code"
                        error={errors.address}
                      />
                      {errors.address && <FieldError message="Residential address is required." />}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Section 3 — Employment & financial */}
              <SectionCard>
                <CardHeader
                  icon={<Wallet className="size-5" aria-hidden="true" />}
                  title="Employment & financial details"
                  subtitle="Helps us assess your eligibility"
                />
                <div className="divide-y divide-border">
                  <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div data-invalid={errors.employmentType || undefined}>
                      <FieldLabel htmlFor="employmentType" required>Employment type</FieldLabel>
                      <Select
                        id="employmentType"
                        value={form.employmentType}
                        onChange={(e) => set("employmentType", e.target.value)}
                        error={errors.employmentType}
                      >
                        <option value="">Select employment type</option>
                        {EMPLOYMENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                      {errors.employmentType && <FieldError message="Employment type is required." />}
                    </div>
                    <div data-invalid={errors.organisation || undefined}>
                      <FieldLabel htmlFor="organisation" required>Organisation name</FieldLabel>
                      <TextInput
                        id="organisation"
                        value={form.organisation}
                        onChange={(e) => set("organisation", e.target.value)}
                        placeholder="Employer or business name"
                        error={errors.organisation}
                      />
                      {errors.organisation && <FieldError message="Organisation name is required." />}
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div data-invalid={errors.monthlyIncome || undefined}>
                      <FieldLabel htmlFor="monthlyIncome" required>Monthly income</FieldLabel>
                      <TextInput
                        id="monthlyIncome"
                        inputMode="numeric"
                        value={form.monthlyIncome}
                        onChange={(e) => set("monthlyIncome", e.target.value.replace(/\D/g, ""))}
                        placeholder="Net take-home (₹)"
                        error={errors.monthlyIncome}
                      />
                      {form.monthlyIncome && (
                        <p className="mt-1 text-xs text-muted-foreground">₹ {formatINR(form.monthlyIncome)}</p>
                      )}
                      {errors.monthlyIncome && <FieldError message="Monthly income is required." />}
                    </div>
                    <div>
                      <FieldLabel htmlFor="existingEmis">Existing EMIs</FieldLabel>
                      <TextInput
                        id="existingEmis"
                        inputMode="numeric"
                        value={form.existingEmis}
                        onChange={(e) => set("existingEmis", e.target.value.replace(/\D/g, ""))}
                        placeholder="Total monthly EMIs (₹)"
                      />
                      {form.existingEmis && (
                        <p className="mt-1 text-xs text-muted-foreground">₹ {formatINR(form.existingEmis)}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 sm:grid-cols-3">
                    <div data-invalid={errors.loanAmount || undefined}>
                      <FieldLabel htmlFor="loanAmount" required>Loan amount required</FieldLabel>
                      <TextInput
                        id="loanAmount"
                        inputMode="numeric"
                        value={form.loanAmount}
                        onChange={(e) => set("loanAmount", e.target.value.replace(/\D/g, ""))}
                        placeholder="Amount (₹)"
                        error={errors.loanAmount}
                      />
                      {form.loanAmount && (
                        <p className="mt-1 text-xs text-muted-foreground">₹ {formatINR(form.loanAmount)}</p>
                      )}
                      {errors.loanAmount && <FieldError message="Loan amount is required." />}
                    </div>
                    <div data-invalid={errors.tenure || undefined}>
                      <FieldLabel htmlFor="tenure" required>Preferred tenure</FieldLabel>
                      <Select
                        id="tenure"
                        value={form.tenure}
                        onChange={(e) => set("tenure", e.target.value)}
                        error={errors.tenure}
                      >
                        <option value="">Select tenure</option>
                        {TENURES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                      {errors.tenure && <FieldError message="Tenure is required." />}
                    </div>
                    <div data-invalid={errors.purpose || undefined}>
                      <FieldLabel htmlFor="purpose" required>Purpose of loan</FieldLabel>
                      <Select
                        id="purpose"
                        value={form.purpose}
                        onChange={(e) => set("purpose", e.target.value)}
                        error={errors.purpose}
                      >
                        <option value="">Select purpose</option>
                        {PURPOSES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </Select>
                      {errors.purpose && <FieldError message="Purpose is required." />}
                    </div>
                  </div>

                  <div className="p-5">
                    <FieldLabel htmlFor="remarks">Additional remarks</FieldLabel>
                    <TextArea
                      id="remarks"
                      rows={3}
                      value={form.remarks}
                      onChange={(e) => set("remarks", e.target.value)}
                      placeholder="Anything else you'd like us to know"
                    />
                  </div>
                </div>
              </SectionCard>

              {/* EMI Calculator — updates live as user fills amount/tenure */}
              <EmiCalculator
                loanType={loanType}
                loanAmount={form.loanAmount}
                tenure={form.tenure}
              />

              {/* Section 4 — Consent & submit */}
              <SectionCard>
                <div className="grid gap-5 p-5">
                  <div className="flex items-start gap-3 rounded-lg bg-accent/10 p-4">
                    <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-foreground">
                      Your information is encrypted and handled in line with our data privacy
                      policy. We never share your details with third parties without your consent.
                    </p>
                  </div>

                  <div
                    className={cn(
                      "rounded-lg border bg-muted p-4",
                      consentError ? "border-destructive" : "border-border",
                    )}
                    data-invalid={consentError || undefined}
                  >
                    <label className="flex items-start gap-3 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked)
                          if (e.target.checked) setConsentError(false)
                        }}
                        className="mt-0.5 size-4 shrink-0 accent-[#0c447c]"
                      />
                      <span className="leading-relaxed">
                        I agree to the{" "}
                        <a href="#" className="text-accent underline-offset-2 hover:underline">terms &amp; conditions</a>{" "}
                        and{" "}
                        <a href="#" className="text-accent underline-offset-2 hover:underline">privacy policy</a>, and
                        consent to being contacted regarding my loan enquiry.
                      </span>
                    </label>
                    {consentError && (
                      <p className="mt-2 text-xs text-destructive">
                        Please accept the terms to submit your enquiry.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Send className="size-4" aria-hidden="true" />
                    Submit loan enquiry
                  </button>
                </div>
              </SectionCard>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}
