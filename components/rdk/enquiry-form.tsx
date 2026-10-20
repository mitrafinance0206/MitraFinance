"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  BUSINESS,
  PRODUCTS,
  TENURE_MONTHS,
  whatsappUrl,
  type Bilingual,
} from "@/lib/rdk";
import {
  EMPTY_ENQUIRY,
  EMPLOYMENT_OPTIONS,
  GENDER_OPTIONS,
  validateEnquiry,
  type EnquiryInput,
  type EnquiryErrors,
} from "@/lib/enquiry";
import { Header } from "./shell";
import { useLanguage } from "./language";

const LABELS: Record<keyof EnquiryInput, Bilingual> = {
  loanType: ["Loan type", "கடன் வகை"],
  fullName: ["Full name", "முழுப் பெயர்"],
  dob: ["Date of birth", "பிறந்த தேதி"],
  gender: ["Gender", "பாலினம்"],
  mobile: ["Mobile number", "கைபேசி எண்"],
  email: ["Email address", "மின்னஞ்சல்"],
  pan: ["PAN number", "PAN எண்"],
  aadhaar: ["Aadhaar number", "ஆதார் எண்"],
  address: ["Residential address", "வீட்டு முகவரி"],
  employmentType: ["Employment type", "வேலை வகை"],
  organisation: ["Company / business name", "நிறுவனம் / தொழில் பெயர்"],
  monthlyIncome: [
    "Monthly salary / income (₹)",
    "மாதச் சம்பளம் / வருமானம் (₹)",
  ],
  existingLoans: ["Existing loans", "தற்போதுள்ள கடன்கள்"],
  existingEmis: [
    "Total existing monthly EMIs (₹)",
    "தற்போதைய மாதத் தவணைகள் (₹)",
  ],
  loanAmount: ["Requested loan amount (₹)", "தேவையான கடன் தொகை (₹)"],
  tenure: ["Preferred tenure", "விருப்பமான கால அளவு"],
  remarks: [
    "Anything else we should know? (optional)",
    "கூடுதல் தகவல் (விருப்பம்)",
  ],
  consent: ["Consent", "ஒப்புதல்"],
};
const OPTIONS: Record<string, Bilingual> = {
  bank_salary: [
    "Salaried — bank-credited salary",
    "சம்பளம் — வங்கிக் கணக்கில்",
  ],
  cash_salary: ["Salaried — cash salary", "சம்பளம் — ரொக்கமாக"],
  self_employed: ["Self-employed", "சுயதொழில்"],
  business_owner: ["Business owner", "தொழில் உரிமையாளர்"],
  female: ["Female", "பெண்"],
  male: ["Male", "ஆண்"],
  other: ["Other", "மற்றவை"],
  prefer_not_to_say: ["Prefer not to say", "குறிப்பிட விரும்பவில்லை"],
};
const ERROR_MESSAGES: Record<string, Bilingual> = {
  required: ["Please complete this field.", "இந்த விவரத்தை நிரப்பவும்."],
  invalid: [
    "Please enter or select a valid value.",
    "சரியான விவரத்தை உள்ளிடவும்.",
  ],
  mobile: [
    "Enter a valid 10-digit Indian mobile number.",
    "சரியான 10 இலக்க இந்திய கைபேசி எண்ணை உள்ளிடவும்.",
  ],
  email: ["Enter a valid email address.", "சரியான மின்னஞ்சலை உள்ளிடவும்."],
  pan: [
    "Use the PAN format ABCDE1234F.",
    "PAN வடிவம் ABCDE1234F ஆக இருக்க வேண்டும்.",
  ],
  aadhaar: [
    "Enter a valid 12-digit Aadhaar number.",
    "சரியான 12 இலக்க ஆதார் எண்ணை உள்ளிடவும்.",
  ],
  dob: [
    "Enter a valid date of birth in the past.",
    "சரியான பிறந்த தேதியை உள்ளிடவும்.",
  ],
  amount: [
    "Enter a valid amount (up to 2 decimal places).",
    "சரியான தொகையை உள்ளிடவும் (2 தசம இடங்கள் வரை).",
  ],
  long: [
    "Please use 1,500 characters or fewer.",
    "1,500 எழுத்துகளுக்குள் உள்ளிடவும்.",
  ],
  personal: [
    "Personal loans require bank-credited monthly salary above ₹20,000. Select another product or contact our team.",
    "தனிநபர் கடனுக்கு வங்கிக் கணக்கில் மாதச் சம்பளம் ₹20,000-க்கு மேல் தேவை. வேறு சேவையைத் தேர்வு செய்யவும் அல்லது எங்களை அழைக்கவும்.",
  ],
  consent: [
    "Please provide your consent to continue.",
    "தொடர உங்கள் ஒப்புதலை வழங்கவும்.",
  ],
};
const PERSONAL_FIELDS: (keyof EnquiryInput)[] = [
  "loanType",
  "fullName",
  "dob",
  "gender",
  "mobile",
  "email",
  "address",
  "pan",
  "aadhaar",
];
const FINANCE_FIELDS: (keyof EnquiryInput)[] = [
  "employmentType",
  "organisation",
  "monthlyIncome",
  "existingLoans",
  "existingEmis",
  "loanAmount",
  "tenure",
  "remarks",
];

export function EnquiryForm({ initialLoan = "" }: { initialLoan?: string }) {
  const { t } = useLanguage();
  const [form, setForm] = useState<EnquiryInput>({
    ...EMPTY_ENQUIRY,
    loanType: PRODUCTS.some((p) => p.id === initialLoan) ? initialLoan : "",
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const submitLock = useRef(false);
  const [reference, setReference] = useState("");
  const [summary, setSummary] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const set = (key: keyof EnquiryInput, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  const move = (next: number) => {
    setStep(next);
    setTimeout(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 0);
  };
  const validate = (keys: (keyof EnquiryInput)[]) => {
    const validation = validateEnquiry(form);
    const selected = Object.fromEntries(
      Object.entries(validation.errors).filter(([key]) =>
        keys.includes(key as keyof EnquiryInput),
      ),
    ) as EnquiryErrors;
    setErrors(selected);
    if (Object.keys(selected).length) {
      setTimeout(
        () => document.getElementById(Object.keys(selected)[0])?.focus(),
        0,
      );
      return false;
    }
    return true;
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitLock.current) return;
    if (step < 2) {
      if (validate(step === 0 ? PERSONAL_FIELDS : FINANCE_FIELDS))
        move(step + 1);
      return;
    }
    if (!validate(Object.keys(EMPTY_ENQUIRY) as (keyof EnquiryInput)[])) return;
    
    // Generate reference ID without database
    const ref = `MF-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const loan = PRODUCTS.find((p) => p.id === form.loanType);
    
    // Create WhatsApp summary
    const message = `Hello Mitra Finance, I have submitted a loan enquiry.

Reference: ${ref}
Name: ${form.fullName}
Mobile: ${form.mobile}
Email: ${form.email}
Date of Birth: ${form.dob}
Gender: ${OPTIONS[form.gender] ? t(OPTIONS[form.gender]) : form.gender}
Address: ${form.address}

Loan Type: ${loan?.name[0]}
Employment: ${OPTIONS[form.employmentType] ? t(OPTIONS[form.employmentType]) : form.employmentType}
Company/Business: ${form.organisation}
Monthly Income: ₹${form.monthlyIncome}
Existing Loans: ${form.existingLoans}
Existing EMIs: ₹${form.existingEmis}
Requested Amount: ₹${form.loanAmount}
Preferred Tenure: ${form.tenure} months
${form.remarks ? `\nAdditional Info: ${form.remarks}` : ''}

Please contact me to discuss the next steps.`;

    setSummary(message);
    setReference(ref);
    setForm({ ...EMPTY_ENQUIRY });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const error = (key: keyof EnquiryInput) =>
    errors[key] ? (
      <span id={`${key}-error`} className="rdk-field-error" role="alert">
        {t(ERROR_MESSAGES[errors[key]!] ?? ERROR_MESSAGES.invalid)}
      </span>
    ) : null;
  const input = (
    key: Exclude<keyof EnquiryInput, "consent">,
    type = "text",
    placeholder = "",
  ) => (
    <div className="rdk-field" key={key}>
      <label htmlFor={key}>
        {t(LABELS[key])}
        {key !== "remarks" && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={key}
        name={key}
        type={type}
        value={form[key]}
        placeholder={placeholder}
        required={key !== "remarks"}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        autoComplete={
          key === "fullName"
            ? "name"
            : key === "mobile"
              ? "tel-national"
              : key === "email"
                ? "email"
                : key === "organisation"
                  ? "organization"
                  : "off"
        }
        maxLength={
          key === "pan" || key === "mobile" ? 10 : key === "aadhaar" ? 14 : 1500
        }
        max={key === "dob" ? new Date().toISOString().slice(0, 10) : undefined}
        min={
          type === "number" ? (key === "existingEmis" ? "0" : "1") : undefined
        }
        step={type === "number" ? ".01" : undefined}
        inputMode={
          key === "pan"
            ? "text"
            : ["mobile", "aadhaar"].includes(key)
              ? "numeric"
              : type === "number"
                ? "decimal"
                : undefined
        }
        onChange={(e) =>
          set(
            key,
            key === "pan" ? e.target.value.toUpperCase() : e.target.value,
          )
        }
      />
      {error(key)}
    </div>
  );
  const select = (
    key: "gender" | "employmentType" | "tenure",
    values: readonly string[],
  ) => (
    <div className="rdk-field">
      <label htmlFor={key}>
        {t(LABELS[key])} <span aria-hidden="true">*</span>
      </label>
      <select
        id={key}
        name={key}
        required
        value={form[key]}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        onChange={(e) => set(key, e.target.value)}
      >
        <option value="">{t(["Select an option", "தேர்வு செய்யவும்"])}</option>
        {values.map((value) => (
          <option key={value} value={value}>
            {key === "tenure"
              ? Number(value) < 12
                ? t([`${value} months`, `${value} மாதங்கள்`])
                : t([
                    `${Number(value) / 12} years`,
                    `${Number(value) / 12} ஆண்டுகள்`,
                  ])
              : t(OPTIONS[value])}
          </option>
        ))}
      </select>
      {error(key)}
    </div>
  );
  const selectedLoan = PRODUCTS.find((p) => p.id === form.loanType);
  const fallbackSummary = `Hello RDK Financial Services, I would like to enquire about a loan. My website enquiry could not be saved.\nName: ${form.fullName}\nMobile: ${form.mobile}\nLoan: ${selectedLoan?.name[0] ?? form.loanType}\nRequested amount: INR ${form.loanAmount}\nPreferred tenure: ${form.tenure} months\nPlease contact me for the remaining details.`;
  const display = (key: keyof EnquiryInput) =>
    key === "loanType"
      ? selectedLoan
        ? t(selectedLoan.name)
        : "—"
      : key === "pan"
        ? `••••••${form.pan.slice(-4)}`
        : key === "aadhaar"
          ? `•••• •••• ${form.aadhaar.replace(/\s/g, "").slice(-4)}`
          : key === "tenure"
            ? t([`${form.tenure} months`, `${form.tenure} மாதங்கள்`])
            : OPTIONS[String(form[key])]
              ? t(OPTIONS[String(form[key])])
              : String(form[key] || "—");
  return (
    <div className="rdk-site">
      <Header />
      <main id="main" className="rdk-apply">
        <div className="rdk-container">
          <Link href="/" className="rdk-text-link">
            <ArrowLeft size={16} />
            {t(["Back to home", "முகப்பிற்குத் திரும்பவும்"])}
          </Link>
          {reference ? (
            <section className="rdk-success">
              <CheckCircle2 size={52} />
              <span className="rdk-eyebrow">
                {t(["ENQUIRY READY", "விசாரணை தயார்"])}
              </span>
              <h1>
                {t([
                  "Perfect! Let's send this\nto our team on WhatsApp.",
                  "சிறப்பு! இதை WhatsApp மூலம்\nஎங்கள் குழுவிற்கு அனுப்புவோம்.",
                ])}
              </h1>
              <p>
                {t([
                  "Your enquiry details are ready. Review the summary below, then tap the button to open WhatsApp and send it to our team.",
                  "உங்கள் விசாரணை விவரங்கள் தயார். கீழே உள்ள சுருக்கத்தை சரிபார்த்து, பொத்தானை அழுத்தி WhatsApp-ஐத் திறந்து எங்கள் குழுவிற்கு அனுப்பவும்.",
                ])}
              </p>
              <div className="rdk-reference">
                {t(["Your reference", "உங்கள் குறிப்பு எண்"])}
                <strong>{reference}</strong>
              </div>
              <pre className="rdk-message-preview">{summary}</pre>
              <p className="rdk-fineprint">
                {t([
                  "PAN and Aadhaar are excluded from the WhatsApp message for your privacy. The message is pre-filled but not sent automatically - you can review and edit before sending.",
                  "உங்கள் தனியுரிமைக்காக PAN மற்றும் ஆதார் WhatsApp செய்தியில் சேர்க்கப்படவில்லை. செய்தி முன்பே நிரப்பப்பட்டுள்ளது ஆனால் தானாக அனுப்பப்படாது - அனுப்புவதற்கு முன் பார்த்து திருத்தலாம்.",
                ])}
              </p>
              <a
                className="rdk-button"
                href={whatsappUrl(summary)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                {t(["Send via WhatsApp", "WhatsApp மூலம் அனுப்பவும்"])}
              </a>
              <a href={BUSINESS.phoneHref} className="rdk-text-link">
                <Phone size={16} />
                {BUSINESS.phone}
              </a>
            </section>
          ) : (
            <>
              <div className="rdk-apply-heading">
                <span className="rdk-eyebrow">
                  {t([
                    "LET'S GET TO KNOW YOUR PLANS",
                    "உங்கள் திட்டத்தை அறியலாம்",
                  ])}
                </span>
                <h1>
                  {t([
                    "Your next step starts here.",
                    "உங்கள் அடுத்த படி இங்கே தொடங்குகிறது.",
                  ])}
                </h1>
                <p>
                  {t([
                    "Share a few details. We'll help you explore the possibilities.",
                    "சில விவரங்களைப் பகிருங்கள். வாய்ப்புகளை அறிய உதவுகிறோம்.",
                  ])}
                </p>
              </div>
              <div className="rdk-application-grid">
                <aside className="rdk-application-aside">
                  <ol>
                    {[
                      ["Your details", "உங்கள் விவரங்கள்"],
                      ["Loan & income", "கடன் & வருமானம்"],
                      ["Review & connect", "சரிபார்த்து இணையுங்கள்"],
                    ].map(([en, ta], i) => (
                      <li
                        key={en}
                        className={step === i ? "active" : ""}
                        aria-current={step === i ? "step" : undefined}
                      >
                        <span>
                          {step > i ? <Check size={16} /> : `0${i + 1}`}
                        </span>
                        {t([en, ta])}
                      </li>
                    ))}
                  </ol>
                  <div className="rdk-aside-help">
                    <MessageCircle size={25} />
                    <h3>
                      {t([
                        "Prefer a conversation?",
                        "நேரடியாகப் பேச விருப்பமா?",
                      ])}
                    </h3>
                    <p>
                      {t([
                        "Our team can help in Tamil or English.",
                        "எங்கள் குழு தமிழ் அல்லது ஆங்கிலத்தில் உதவும்.",
                      ])}
                    </p>
                    <a href={BUSINESS.phoneHref}>
                      {BUSINESS.phone}
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </aside>
                <form className="rdk-form" onSubmit={submit} noValidate>
                  <h2 ref={heading} tabIndex={-1}>
                    {t(
                      step === 0
                        ? [
                            "First, a little about you",
                            "முதலில், உங்களைப் பற்றி",
                          ]
                        : step === 1
                          ? [
                              "Let's understand your requirement",
                              "உங்கள் தேவையைப் புரிந்துகொள்வோம்",
                            ]
                          : [
                              "Everything look right?",
                              "எல்லா விவரங்களும் சரியா?",
                            ],
                    )}
                  </h2>
                  <p className="rdk-form-intro">
                    {t([
                      "Fields marked * are required.",
                      "* குறியிட்ட விவரங்கள் கட்டாயம்.",
                    ])}
                  </p>
                  <fieldset>
                    {step === 0 && (
                      <>
                        <div className="rdk-field">
                          <label htmlFor="loanType">
                            {t(LABELS.loanType)} *
                          </label>
                          <select
                            id="loanType"
                            value={form.loanType}
                            onChange={(e) => set("loanType", e.target.value)}
                            required
                            aria-invalid={!!errors.loanType}
                            aria-describedby={
                              errors.loanType ? "loanType-error" : undefined
                            }
                          >
                            <option value="">
                              {t([
                                "Choose your loan",
                                "கடனைத் தேர்வு செய்யவும்",
                              ])}
                            </option>
                            {PRODUCTS.map((p) => (
                              <option key={p.id} value={p.id}>
                                {t(p.name)}
                              </option>
                            ))}
                          </select>
                          {error("loanType")}
                        </div>
                        {selectedLoan && (
                          <p className="rdk-form-notice">
                            {t(selectedLoan.eligibility)}
                          </p>
                        )}
                        <div className="rdk-field-grid">
                          {input("fullName")}
                          {input("dob", "date")}
                          {select("gender", GENDER_OPTIONS)}
                          {input("mobile", "tel", "9876543210")}
                          {input("email", "email", "name@example.com")}
                          {input("pan", "text", "ABCDE1234F")}
                          {input("aadhaar", "text", "XXXX XXXX XXXX")}
                        </div>
                        <div className="rdk-field">
                          <label htmlFor="address">{t(LABELS.address)} *</label>
                          <textarea
                            id="address"
                            value={form.address}
                            maxLength={1500}
                            rows={3}
                            required
                            aria-invalid={!!errors.address}
                            aria-describedby={
                              errors.address ? "address-error" : undefined
                            }
                            autoComplete="street-address"
                            onChange={(e) => set("address", e.target.value)}
                          />
                          {error("address")}
                        </div>
                        <p className="rdk-fineprint">
                          {t([
                            "Your details are used by Mitra Finance to assess and follow up on this enquiry. Identity numbers stay out of the WhatsApp summary.",
                            "உங்கள் விவரங்கள் இந்த விசாரணையை மதிப்பிட்டு தொடர்புகொள்ள Mitra Finance-ஆல் பயன்படுத்தப்படும். அடையாள எண்கள் WhatsApp சுருக்கத்தில் இடம்பெறாது.",
                          ])}
                        </p>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <div className="rdk-field-grid">
                          {select("employmentType", EMPLOYMENT_OPTIONS)}
                          {input("organisation")}
                          {input("monthlyIncome", "number")}
                          {input("existingEmis", "number")}
                          {input("loanAmount", "number")}
                          {select("tenure", TENURE_MONTHS.map(String))}
                        </div>
                        <div className="rdk-field">
                          <label htmlFor="existingLoans">
                            {t(LABELS.existingLoans)} *
                          </label>
                          <textarea
                            id="existingLoans"
                            rows={2}
                            maxLength={1500}
                            required
                            aria-invalid={!!errors.existingLoans}
                            aria-describedby={
                              errors.existingLoans
                                ? "existingLoans-error"
                                : undefined
                            }
                            value={form.existingLoans}
                            placeholder={t([
                              "Loan type and outstanding amount, or 'None'",
                              "கடன் வகை மற்றும் நிலுவைத் தொகை, அல்லது 'இல்லை'",
                            ])}
                            onChange={(e) =>
                              set("existingLoans", e.target.value)
                            }
                          />
                          {error("existingLoans")}
                        </div>
                        {input("remarks")}
                        <p className="rdk-form-notice">
                          {t([
                            "Preferred tenure is up to 25 years. Available tenure, rate and fees depend on the loan type and lender. No rate is guaranteed by this enquiry.",
                            "விருப்பமான கால அளவு 25 ஆண்டுகள் வரை. கிடைக்கும் காலம், வட்டி மற்றும் கட்டணங்கள் கடன் வகை மற்றும் வழங்குநரைப் பொறுத்தவை.",
                          ])}
                        </p>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <dl className="rdk-review">
                          {[...PERSONAL_FIELDS, ...FINANCE_FIELDS].map(
                            (key) => (
                              <div key={key}>
                                <dt>{t(LABELS[key])}</dt>
                                <dd>{display(key)}</dd>
                              </div>
                            ),
                          )}
                        </dl>
                        <label className="rdk-consent">
                          <input
                            id="consent"
                            type="checkbox"
                            checked={form.consent}
                            aria-invalid={!!errors.consent}
                            aria-describedby={
                              errors.consent ? "consent-error" : undefined
                            }
                            onChange={(e) => set("consent", e.target.checked)}
                          />
                          <span>
                            {t([
                              "I agree that Mitra Finance may store and use these details to assess my enquiry and contact me by phone, email or WhatsApp. I understand this is an enquiry, not a loan approval.",
                              "இந்த விவரங்களைச் சேமித்து என் விசாரணையை மதிப்பிடவும், தொலைபேசி, மின்னஞ்சல் அல்லது WhatsApp மூலம் தொடர்புகொள்ளவும் Mitra Finance-க்கு ஒப்புதல் அளிக்கிறேன். இது விசாரணை மட்டுமே, கடன் ஒப்புதல் அல்ல என்பதைப் புரிந்துகொள்கிறேன்.",
                            ])}
                          </span>
                        </label>
                        {error("consent")}
                      </>
                    )}
                    <div className="rdk-form-actions">
                      {step > 0 && (
                        <button
                          type="button"
                          className="rdk-button rdk-button-outline"
                          onClick={() => move(step - 1)}
                        >
                          <ArrowLeft size={16} />
                          {t(["Back", "முந்தையது"])}
                        </button>
                      )}
                      <button type="submit" className="rdk-button">
                        {t(
                          step === 2
                              ? [
                                  "Review & send",
                                  "பார்த்து அனுப்பவும்",
                                ]
                              : ["Continue", "தொடரவும்"],
                        )}
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
