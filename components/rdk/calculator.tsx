"use client";
import { useState } from "react";
import { ArrowUpRight, Calculator } from "lucide-react";
import Link from "next/link";
import { calculateEmi } from "@/lib/emi";
import { useLanguage } from "./language";

export function CalculatorSection() {
  const { language, t } = useLanguage();
  const [amount, setAmount] = useState("1000000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("10");
  const [method, setMethod] = useState<"reducing" | "flat">("reducing");
  const result =
    amount && rate && years && Number.isInteger(Number(years))
      ? calculateEmi(Number(amount), Number(rate), Number(years) * 12, method)
      : null;
  const currency = (value: number) =>
    new Intl.NumberFormat(language === "en" ? "en-IN" : "ta-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  return (
    <section id="calculator" className="rdk-section rdk-calculator-section">
      <div className="rdk-container">
        <div className="rdk-section-heading">
          <div>
            <span className="rdk-eyebrow">
              <Calculator size={15} />
              {t(["PLAN WITH CLARITY", "தெளிவாகத் திட்டமிடுங்கள்"])}
            </span>
            <h2>
              {t([
                "A little planning.\nA clearer tomorrow.",
                "இன்றைய திட்டம்.\nதெளிவான நாளை.",
              ])}
            </h2>
          </div>
          <p>
            {t([
              "Explore your monthly repayments before you take the next step. Adjust the numbers to suit your plans.",
              "அடுத்த படிக்கு முன் மாதத் தவணையை மதிப்பிடுங்கள். உங்கள் திட்டத்திற்கேற்ப விவரங்களை மாற்றுங்கள்.",
            ])}
          </p>
        </div>
        <div className="rdk-calculator">
          <div className="rdk-calculator-inputs">
            <div
              className="rdk-method"
              role="group"
              aria-label={t([
                "Interest calculation method",
                "வட்டி கணக்கீட்டு முறை",
              ])}
            >
              <button
                aria-pressed={method === "reducing"}
                onClick={() => setMethod("reducing")}
              >
                {t(["Reducing balance", "குறையும் இருப்பு"])}
              </button>
              <button
                aria-pressed={method === "flat"}
                onClick={() => setMethod("flat")}
              >
                {t(["Flat rate", "நிலையான வட்டி"])}
              </button>
            </div>
            <label htmlFor="calc-amount">
              {t(["Loan amount (₹)", "கடன் தொகை (₹)"])}
            </label>
            <input
              id="calc-amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="rdk-calculator-pair">
              <div>
                <label htmlFor="calc-rate">
                  {t(["Annual interest rate (%)", "ஆண்டு வட்டி விகிதம் (%)"])}
                </label>
                <input
                  id="calc-rate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="calc-years">
                  {t(["Tenure (years)", "கால அளவு (ஆண்டுகள்)"])}
                </label>
                <input
                  id="calc-years"
                  type="number"
                  min="1"
                  max="25"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
            </div>
            <input
              aria-label={t([
                "Adjust tenure in years",
                "ஆண்டுகளில் கால அளவை மாற்றவும்",
              ])}
              className="rdk-range"
              type="range"
              min="1"
              max="25"
              value={Math.min(25, Math.max(1, Number(years)))}
              onChange={(e) => setYears(e.target.value)}
            />
            <div className="rdk-range-labels">
              <span>{t(["1 year", "1 ஆண்டு"])}</span>
              <span>{t(["25 years", "25 ஆண்டுகள்"])}</span>
            </div>
            <p className="rdk-fineprint">
              {t([
                "The default rate is an illustration, not a lender offer. Processing fees, taxes and other charges are excluded; confirm these with our team. OD / CC repayments follow the facility's terms.",
                "இங்கு காட்டப்படும் விகிதம் எடுத்துக்காட்டு மட்டுமே. செயலாக்கக் கட்டணம், வரிகள் மற்றும் பிற செலவுகள் சேர்க்கப்படவில்லை. OD / CC திருப்பிச் செலுத்தல் அந்த வசதியின் விதிமுறைகளைப் பொறுத்தது.",
              ])}
            </p>
          </div>
          <div
            className="rdk-calculator-result"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="rdk-eyebrow">
              {t(["ESTIMATED MONTHLY EMI", "மதிப்பிடப்பட்ட மாதத் தவணை"])}
            </span>
            <strong className="rdk-emi-value">
              {result ? currency(result.monthly) : "—"}
            </strong>
            <span className="rdk-emi-note">
              {t([
                "A starting point for your plans",
                "உங்கள் திட்டத்திற்கான தொடக்க மதிப்பீடு",
              ])}
            </span>
            {result ? (
              <>
                <div className="rdk-breakdown-bar">
                  <span
                    style={{
                      width: `${(Number(amount) / result.total) * 100}%`,
                    }}
                  />
                </div>
                <dl className="rdk-breakdown">
                  <div>
                    <dt>{t(["Principal amount", "அசல் தொகை"])}</dt>
                    <dd>{currency(Number(amount))}</dd>
                  </div>
                  <div>
                    <dt>{t(["Total interest", "மொத்த வட்டி"])}</dt>
                    <dd>{currency(result.interest)}</dd>
                  </div>
                  <div>
                    <dt>
                      {t(["Total repayment", "மொத்தத் திருப்பிச் செலுத்தல்"])}
                    </dt>
                    <dd>{currency(result.total)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p role="status">
                {t([
                  "Enter a positive amount, a non-negative rate and a tenure of 1–25 whole years.",
                  "நேர்மறைத் தொகை, பூஜ்யம் அல்லது அதற்கு மேலான வட்டி, 1–25 முழு ஆண்டுகளை உள்ளிடவும்.",
                ])}
              </p>
            )}
            <Link href="/apply" className="rdk-button rdk-button-lime">
              {t(["Find my loan options", "கடன் வாய்ப்புகளை அறிய"])}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
