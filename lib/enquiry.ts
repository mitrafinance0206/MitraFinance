import { PRODUCTS, TENURE_MONTHS } from "./rdk";

export const EMPTY_ENQUIRY = {
  loanType: "",
  fullName: "",
  dob: "",
  gender: "",
  mobile: "",
  email: "",
  pan: "",
  aadhaar: "",
  address: "",
  employmentType: "",
  organisation: "",
  monthlyIncome: "",
  existingLoans: "",
  existingEmis: "0",
  loanAmount: "",
  tenure: "",
  remarks: "",
  consent: false,
};
export type EnquiryInput = typeof EMPTY_ENQUIRY;
export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;
export const EMPLOYMENT_OPTIONS = [
  "bank_salary",
  "cash_salary",
  "self_employed",
  "business_owner",
] as const;
export const GENDER_OPTIONS = [
  "female",
  "male",
  "other",
  "prefer_not_to_say",
] as const;

export function validateEnquiry(input: unknown): {
  data: EnquiryInput;
  errors: EnquiryErrors;
} {
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const data = { ...EMPTY_ENQUIRY };
  for (const key of Object.keys(EMPTY_ENQUIRY) as (keyof EnquiryInput)[]) {
    if (key === "consent") data.consent = source.consent === true;
    else data[key] = typeof source[key] === "string" ? source[key].trim() : "";
  }
  data.pan = data.pan.toUpperCase();
  data.aadhaar = data.aadhaar.replace(/\s/g, "");
  const errors: EnquiryErrors = {};
  for (const key of [
    "loanType",
    "fullName",
    "dob",
    "gender",
    "mobile",
    "email",
    "address",
    "employmentType",
    "organisation",
    "monthlyIncome",
    "existingLoans",
    "existingEmis",
    "loanAmount",
    "tenure",
  ] as const) {
    if (!data[key]) errors[key] = "required";
  }
  if (!PRODUCTS.some((p) => p.id === data.loanType))
    errors.loanType = "invalid";
  if (data.fullName.length < 2 || data.fullName.length > 120)
    errors.fullName = "invalid";
  if (!/^[6-9]\d{9}$/.test(data.mobile)) errors.mobile = "mobile";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    errors.email = "email";
  if (data.pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(data.pan)) errors.pan = "pan";
  if (data.aadhaar && !/^[2-9]\d{11}$/.test(data.aadhaar)) errors.aadhaar = "aadhaar";
  const birth = new Date(data.dob + "T00:00:00Z");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.dob) ||
    !Number.isFinite(birth.getTime()) ||
    birth.toISOString().slice(0, 10) !== data.dob ||
    birth >= new Date() ||
    birth.getUTCFullYear() < 1900
  )
    errors.dob = "dob";
  if (!(GENDER_OPTIONS as readonly string[]).includes(data.gender))
    errors.gender = "invalid";
  if (!(EMPLOYMENT_OPTIONS as readonly string[]).includes(data.employmentType))
    errors.employmentType = "invalid";
  for (const key of ["monthlyIncome", "loanAmount", "existingEmis"] as const) {
    const number = Number(data[key]);
    if (
      !/^\d+(\.\d{1,2})?$/.test(data[key]) ||
      !Number.isFinite(number) ||
      number < (key === "existingEmis" ? 0 : 1) ||
      number > 1e10
    )
      errors[key] = "amount";
  }
  if (!TENURE_MONTHS.includes(Number(data.tenure))) errors.tenure = "invalid";
  for (const key of [
    "address",
    "organisation",
    "existingLoans",
    "remarks",
  ] as const) {
    if (data[key].length > 1500) errors[key] = "long";
  }
  if (
    data.loanType === "personal" &&
    (data.employmentType !== "bank_salary" ||
      Number(data.monthlyIncome) <= 20000)
  )
    errors.monthlyIncome = "personal";
  if (!data.consent) errors.consent = "consent";
  return { data, errors };
}
