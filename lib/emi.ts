export function calculateEmi(
  principal: number,
  annualRate: number,
  months: number,
  method: "reducing" | "flat",
) {
  if (
    !Number.isFinite(principal) ||
    principal <= 0 ||
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 300
  )
    return null;
  const rate = annualRate / 1200;
  const monthly =
    annualRate === 0
      ? principal / months
      : method === "flat"
        ? (principal + (((principal * annualRate) / 100) * months) / 12) /
          months
        : (principal * rate) / (1 - Math.pow(1 + rate, -months));
  const total = monthly * months;
  if (!Number.isFinite(monthly) || !Number.isFinite(total)) return null;
  return { monthly, total, interest: Math.max(0, total - principal) };
}
