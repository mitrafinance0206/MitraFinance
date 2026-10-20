"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  Phone,
  MessageCircle,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { BUSINESS, whatsappUrl } from "@/lib/rdk";
import { useLanguage } from "./language";
import { GuideModal } from "./guide-modal";

export function Brand() {
  return (
    <Link
      href="/"
      className="rdk-brand"
      aria-label="Mitra Finance home"
    >
      <BrandLogo className="rdk-business-logo" priority />
    </Link>
  );
}
export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const links = [
    ["Loan solutions", "கடன் சேவைகள்", "/#loans"],
    ["About us", "எங்களைப் பற்றி", "/#about"],
    ["EMI calculator", "EMI கணக்கீடு", "/#calculator"],
    ["Contact", "தொடர்பு", "/#contact"],
  ];
  return (
    <>
      <a className="rdk-skip" href="#main">
        {t(["Skip to content", "உள்ளடக்கத்திற்குச் செல்லவும்"])}
      </a>
      <div className="rdk-topbar">
        <div className="rdk-container">
          <span>
            <MapPin size={13} />
            {t([
              "Coimbatore · Here for your next step",
              "கோயம்புத்தூர் · உங்கள் அடுத்த முன்னேற்றத்திற்கு",
            ])}
          </span>
          <a href={BUSINESS.phoneHref}>
            <Phone size={13} />
            {BUSINESS.phone}
          </a>
        </div>
      </div>
      <header className="rdk-header">
        <div className="rdk-container rdk-nav">
          <Brand />
          <nav
            aria-label={t(["Main navigation", "முதன்மை வழிசெலுத்தல்"])}
            className={open ? "rdk-navlinks is-open" : "rdk-navlinks"}
          >
            {links.map(([en, ta, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {t([en, ta])}
              </Link>
            ))}
          </nav>
          <div className="rdk-nav-actions">
            <button
              className="rdk-guide-button"
              onClick={() => setGuideModalOpen(true)}
            >
              <HelpCircle size={16} />
              {t(["Need guide?", "வழிகாட்டுதல்?"])}
            </button>
            <button
              className="rdk-language"
              onClick={() => setLanguage(language === "en" ? "ta" : "en")}
              aria-label={
                language === "en" ? "Switch to Tamil" : "Switch to English"
              }
            >
              {language === "en" ? "தமிழ்" : "English"}
            </button>
            <Link className="rdk-button rdk-nav-apply" href="/apply">
              {t(["Enquire now", "விண்ணப்பிக்க"])}
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="rdk-menu"
              aria-expanded={open}
              aria-label={t(["Toggle navigation", "பட்டியலைத் திறக்க"])}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <GuideModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />
    </>
  );
}
export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="rdk-footer">
      <div className="rdk-container">
        <div className="rdk-footer-grid">
          <div>
            <Brand />
            <p>
              {t([
                "Local understanding. More possibilities. Loan guidance for your next chapter.",
                "உள்ளூர் புரிதல். அதிக வாய்ப்புகள். உங்கள் அடுத்த முன்னேற்றத்திற்கான கடன் வழிகாட்டுதல்.",
              ])}
            </p>
          </div>
          <div>
            <h3>{t(["Let's talk", "பேசலாம்"])}</h3>
            <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            <a
              href={whatsappUrl(
                "Hello Mitra Finance, I would like to enquire about a loan.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp <ArrowUpRight size={13} />
            </a>
          </div>
          <div>
            <h3>{t(["Visit us", "எங்களைச் சந்திக்கவும்"])}</h3>
            <p>
              {t([
                BUSINESS.address,
                "169, 2வது மாடி, NVN லேஅவுட், நியூ சித்தாபுதூர், கோயம்புத்தூர் - 641044, தமிழ்நாடு",
              ])}
            </p>
            <span>
              {t(["Social", "சமூக வலைத்தளம்"])}: @{BUSINESS.socialHandle}
            </span>
          </div>
        </div>
        <div className="rdk-footer-bottom">
          <span>
            © {new Date().getFullYear()} {BUSINESS.name}
          </span>
          <p>
            {t([
              "Loan approval, rates and fees depend on the lender's assessment and terms.",
              "கடன் ஒப்புதல், வட்டி மற்றும் கட்டணங்கள் கடன் வழங்குநரின் மதிப்பீடு மற்றும் விதிமுறைகளைப் பொறுத்தவை.",
            ])}
          </p>
        </div>
      </div>
    </footer>
  );
}
export function WhatsAppButton() {
  const { t } = useLanguage();
  return (
    <a
      className="rdk-floating-wa"
      href={whatsappUrl(
        "Hello Mitra Finance, I would like help with a loan enquiry.",
      )}
      target="_blank"
      rel="noreferrer"
      aria-label={t([
        "Chat with Mitra Finance on WhatsApp",
        "WhatsApp மூலம் Mitra Finance-ஐ தொடர்புகொள்ளவும்",
      ])}
    >
      <MessageCircle size={23} />
      <span>{t(["Let's talk", "பேசலாம்"])}</span>
    </a>
  );
}
