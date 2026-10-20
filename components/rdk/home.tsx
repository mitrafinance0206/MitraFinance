"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Home,
  UserRound,
  Building2,
  BriefcaseBusiness,
  Check,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Plus,
} from "lucide-react";
import { BUSINESS, PRODUCTS, whatsappUrl, type Bilingual } from "@/lib/rdk";
import { Header, WhatsAppButton } from "./shell";
import { useLanguage } from "./language";
import { CalculatorSection } from "./calculator";

const ICONS = {
  person: UserRound,
  home: Home,
  property: Building2,
  business: BriefcaseBusiness,
};
const STEPS: { title: Bilingual; body: Bilingual }[] = [
  {
    title: ["Tell us your plans", "உங்கள் தேவையைக் கூறுங்கள்"],
    body: [
      "Choose a loan and share your contact, income and loan requirements through the enquiry form.",
      "கடனைத் தேர்வு செய்து தொடர்பு, வருமானம் மற்றும் கடன் தேவைகளைப் பகிருங்கள்.",
    ],
  },
  {
    title: ["Connect on WhatsApp", "WhatsApp-இல் இணையுங்கள்"],
    body: [
      "Review your enquiry summary and send it to our team on WhatsApp to start a conversation.",
      "உங்கள் விசாரணைச் சுருக்கத்தை சரிபார்த்து WhatsApp மூலம் எங்கள் குழுவுக்கு அனுப்புங்கள்.",
    ],
  },
  {
    title: ["Explore your options", "வாய்ப்புகளை அறியுங்கள்"],
    body: [
      "Our team discusses suitable lenders and the documents, terms and next steps for your application.",
      "பொருத்தமான கடன் வழங்குநர்கள், ஆவணங்கள், விதிமுறைகள் மற்றும் அடுத்த படிகளை எங்கள் குழு விளக்கும்.",
    ],
  },
];
const FAQS: { q: Bilingual; a: Bilingual }[] = [
  {
    q: [
      "Which loans can I enquire about?",
      "எந்தக் கடன்களைப் பற்றி விசாரிக்கலாம்?",
    ],
    a: [
      "Personal loans, home loans, loans against property and overdraft / cash credit facilities.",
      "தனிநபர் கடன், வீட்டுக் கடன், சொத்து அடமானக் கடன் மற்றும் OD / CC வசதிகளைப் பற்றி விசாரிக்கலாம்.",
    ],
  },
  {
    q: [
      "Who can enquire about a personal loan?",
      "தனிநபர் கடனுக்கு யார் விசாரிக்கலாம்?",
    ],
    a: [
      "Applicants receiving a bank-credited monthly salary above ₹20,000. Final eligibility is assessed by the lender.",
      "வங்கிக் கணக்கில் மாதச் சம்பளம் ₹20,000-க்கு மேல் பெறுபவர்கள் விசாரிக்கலாம். இறுதித் தகுதியைக் கடன் வழங்குநர் மதிப்பிடுவார்.",
    ],
  },
  {
    q: [
      "Is the EMI estimate a confirmed offer?",
      "EMI மதிப்பீடு உறுதியான சலுகையா?",
    ],
    a: [
      "No. The calculator uses your chosen amount, rate, tenure and method. Lender rates and fees are confirmed separately. OD / CC repayments depend on the facility terms.",
      "இல்லை. நீங்கள் தேர்வு செய்யும் தொகை, வட்டி, காலம் மற்றும் முறையைப் பொறுத்து கணக்கிடப்படுகிறது. OD / CC திருப்பிச் செலுத்தல் அந்த வசதியின் விதிமுறைகளைப் பொறுத்தது.",
    ],
  },
  {
    q: [
      "How will my enquiry reach the team?",
      "என் விசாரணை குழுவை எப்படிச் சென்றடையும்?",
    ],
    a: [
      "After your enquiry is saved, use the WhatsApp button to review and send a short summary. PAN and Aadhaar are not included in that message. You can also call us directly.",
      "விசாரணை சேமிக்கப்பட்ட பிறகு, WhatsApp பொத்தானைப் பயன்படுத்தி சுருக்கத்தைச் சரிபார்த்து அனுப்புங்கள். PAN மற்றும் ஆதார் அந்தச் செய்தியில் இடம்பெறாது. நேரடியாகவும் அழைக்கலாம்.",
    ],
  },
  {
    q: [
      "Which documents should I prepare?",
      "எந்த ஆவணங்களைத் தயாராக வைத்திருக்க வேண்டும்?",
    ],
    a: [
      "Requirements vary by lender and loan type. Contact our team for the checklist that applies to your profile before sharing documents.",
      "ஆவணத் தேவைகள் கடன் வகை மற்றும் கடன் வழங்குநரைப் பொறுத்து மாறும். ஆவணங்களைப் பகிர்வதற்கு முன் எங்கள் குழுவிடம் பட்டியலைப் பெறுங்கள்.",
    ],
  },
];
export function RdkHome() {
  const { t } = useLanguage();
  return (
    <div className="rdk-site">
      <Header />
      <main id="main">
        <section className="rdk-hero">
          <div className="rdk-container rdk-hero-grid">
            <div className="rdk-hero-copy">
              <span className="rdk-eyebrow">
                <span className="rdk-status-dot" />
                {t([
                  "YOUR LOCAL FINANCE PARTNER",
                  "உங்கள் உள்ளூர் நிதி வழிகாட்டி",
                ])}
              </span>
              <h1>
                {t(["Big plans.\nThe right", "பெரிய கனவுகள்.\nசரியான"])}{" "}
                <em>{t(["possibilities.", "வாய்ப்புகள்."])}</em>
              </h1>
              <p>
                {t([
                  "A home of your own. A fresh start. Room for your business to grow. Find a loan that fits your next chapter with Mitra Finance.",
                  "சொந்த வீடு. புதிய தொடக்கம். தொழில் வளர்ச்சி. உங்கள் அடுத்த முன்னேற்றத்திற்கேற்ற கடனை Mitra Finance உடன் கண்டறியுங்கள்.",
                ])}
              </p>
              <div className="rdk-hero-actions">
                <Link href="/apply" className="rdk-button">
                  {t([
                    "Let's find your loan",
                    "உங்கள் கடனைத் தேர்வு செய்யுங்கள்",
                  ])}
                  <ArrowUpRight size={18} />
                </Link>
                <a href="#calculator" className="rdk-text-link">
                  {t(["Calculate your EMI", "EMI கணக்கிடுங்கள்"])}
                  <ArrowRight size={16} />
                </a>
              </div>
              <div className="rdk-hero-trust">
                <span>
                  <Check size={16} />
                  {t(["Personal guidance", "தனிப்பட்ட வழிகாட்டுதல்"])}
                </span>
                <span>
                  <Check size={16} />
                  {t(["Tamil & English support", "தமிழ் & ஆங்கில உதவி"])}
                </span>
              </div>
            </div>
            <div className="rdk-hero-visual">
              <div className="rdk-photo-label">
                <span className="rdk-status-dot" />
                {t([
                  "Your next chapter starts here",
                  "உங்கள் அடுத்த தொடக்கம் இங்கே",
                ])}
              </div>
              <Image
                src="/images/hero-finance.png"
                alt={t([
                  "A couple discussing their plans with a financial advisor",
                  "நிதி ஆலோசகருடன் தங்கள் திட்டங்களைப் பேசும் தம்பதியினர்",
                ])}
                width={720}
                height={560}
                priority
              />
              <div className="rdk-hero-note">
                <span className="rdk-note-icon">
                  <Building2 size={26} />
                </span>
                <div>
                  <strong>100+</strong>
                  <span>
                    {t(["Bank & NBFC tie-ups", "வங்கி & NBFC இணைப்புகள்"])}
                  </span>
                </div>
                <ArrowUpRight size={24} />
              </div>
              <span className="rdk-photo-caption">
                {t([
                  "LOCAL ROOTS. BIGGER POSSIBILITIES.",
                  "உள்ளூர் புரிதல். அதிக வாய்ப்புகள்.",
                ])}
              </span>
            </div>
          </div>
        </section>
        <div className="rdk-proof-strip">
          <div className="rdk-container">
            <span>
              {t([
                "A partner for every next step",
                "ஒவ்வொரு முன்னேற்றத்திற்கும் துணை",
              ])}
            </span>
            <div>
              {t(["100+ lender tie-ups", "100+ கடன் வழங்குநர் இணைப்புகள்"])}
            </div>
            <div>{t(["4 lending solutions", "4 கடன் சேவைகள்"])}</div>
            <div>{t(["Based in Avinashi", "அவிநாசியில் உங்கள் அருகில்"])}</div>
          </div>
        </div>
        <section id="loans" className="rdk-section">
          <div className="rdk-container">
            <div className="rdk-section-heading">
              <div>
                <span className="rdk-eyebrow">
                  {t(["FIND YOUR FIT", "உங்களுக்கான சேவை"])}
                </span>
                <h2>
                  {t([
                    "Different dreams.\nThoughtful loan solutions.",
                    "வெவ்வேறு கனவுகள்.\nபொருத்தமான கடன் சேவைகள்.",
                  ])}
                </h2>
              </div>
              <p>
                {t([
                  "Tell us what you have in mind. We'll help you explore options across our network of banks and NBFCs.",
                  "உங்கள் தேவையை எங்களிடம் கூறுங்கள். எங்கள் வங்கிகள் மற்றும் NBFC வலையமைப்பில் வாய்ப்புகளை அறிய உதவுகிறோம்.",
                ])}
              </p>
            </div>
            <div className="rdk-product-grid">
              {PRODUCTS.map((product, index) => {
                const Icon = ICONS[product.icon];
                return (
                  <article key={product.id} className="rdk-product">
                    <div className="rdk-product-top">
                      <span className="rdk-product-icon">
                        <Icon size={25} />
                      </span>
                      <span>0{index + 1}</span>
                    </div>
                    <h3>{t(product.name)}</h3>
                    <p>{t(product.description)}</p>
                    <div className="rdk-eligibility">
                      {t(product.eligibility)}
                    </div>
                    <Link
                      href={`/apply?loan=${product.id}`}
                      className="rdk-product-link"
                    >
                      {t([
                        "Enquire about this loan",
                        "இந்தக் கடனைப் பற்றி விசாரிக்க",
                      ])}
                      <ArrowUpRight size={19} />
                    </Link>
                  </article>
                );
              })}
            </div>
            <p className="rdk-section-note">
              {t([
                "Rates, loan amounts, documents and processing fees are confirmed by the lender after reviewing your profile.",
                "வட்டி, கடன் தொகை, ஆவணங்கள் மற்றும் செயலாக்கக் கட்டணங்கள் உங்கள் விவரங்களை மதிப்பிட்ட பிறகு கடன் வழங்குநரால் உறுதிப்படுத்தப்படும்.",
              ])}
            </p>
          </div>
        </section>
        <section id="about" className="rdk-section rdk-about">
          <div className="rdk-container rdk-about-grid">
            <div className="rdk-about-panel">
              <span className="rdk-eyebrow">
                {t(["ROOTED IN YOUR COMMUNITY", "உங்கள் ஊரில், உங்களுக்காக"])}
              </span>
              <span className="rdk-large-number">
                100<span>+</span>
              </span>
              <h3>
                {t([
                  "Banks & NBFCs.\nMore doors to open.",
                  "வங்கிகள் & NBFCகள்.\nஅதிக வாய்ப்புகள்.",
                ])}
              </h3>
              <div>
                <MapPin size={16} />
                {t([
                  "Coimbatore, Tamil Nadu",
                  "கோயம்புத்தூர், தமிழ்நாடு",
                ])}
              </div>
            </div>
            <div className="rdk-about-copy">
              <span className="rdk-eyebrow">
                {t(["MEET MITRA FINANCE", "MITRA FINANCE"])}
              </span>
              <h2>
                {t([
                  "Finance feels better\nwith someone by your side.",
                  "உங்களுடன் ஒருவர்.\nநிதியில் தெளிவான வழி.",
                ])}
              </h2>
              <p>
                {t([
                  "Based in Avinashi, Mitra Finance helps individuals and businesses explore borrowing options through tie-ups with over 100 banks and NBFCs.",
                  "அவிநாசியில் செயல்படும் Mitra Finance, 100-க்கும் மேற்பட்ட வங்கிகள் மற்றும் NBFCகளின் இணைப்புகள் மூலம் தனிநபர்கள் மற்றும் தொழில்களுக்கான கடன் வாய்ப்புகளை அறிய உதவுகிறது.",
                ])}
              </p>
              <p>
                {t([
                  "From understanding your requirements to discussing the next steps, our team is here to make the conversation simpler, in Tamil or English.",
                  "உங்கள் தேவைகளைப் புரிந்துகொள்வது முதல் அடுத்த படிகளை விளக்குவது வரை, தமிழ் அல்லது ஆங்கிலத்தில் எங்கள் குழு உதவுகிறது.",
                ])}
              </p>
              <a className="rdk-text-link" href={BUSINESS.phoneHref}>
                {t(["Talk to our team", "எங்கள் குழுவுடன் பேசுங்கள்"])}
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>
        <CalculatorSection />
        <section id="process" className="rdk-section">
          <div className="rdk-container">
            <div className="rdk-section-heading">
              <div>
                <span className="rdk-eyebrow">
                  {t([
                    "SMALL STEPS, REAL PROGRESS",
                    "எளிய படிகள், உண்மையான முன்னேற்றம்",
                  ])}
                </span>
                <h2>
                  {t([
                    "From a question\nto your next step.",
                    "ஒரு கேள்வியிலிருந்து\nஉங்கள் அடுத்த படிக்கு.",
                  ])}
                </h2>
              </div>
            </div>
            <div className="rdk-process-grid">
              {STEPS.map((step, i) => (
                <article key={i}>
                  <span className="rdk-step-number">0{i + 1}</span>
                  <h3>{t(step.title)}</h3>
                  <p>{t(step.body)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="rdk-section rdk-faq">
          <div className="rdk-container rdk-faq-grid">
            <div>
              <span className="rdk-eyebrow">
                {t(["A LITTLE MORE CLARITY", "மேலும் தெளிவாக"])}
              </span>
              <h2>
                {t([
                  "Good questions.\nClear answers.",
                  "உங்கள் கேள்விகள்.\nதெளிவான பதில்கள்.",
                ])}
              </h2>
              <p>
                {t([
                  "Still have a question? We're just a conversation away.",
                  "மேலும் கேள்விகள் உள்ளதா? எங்களைத் தொடர்புகொள்ளுங்கள்.",
                ])}
              </p>
              <a className="rdk-text-link" href={BUSINESS.phoneHref}>
                {t(["Call Mitra Finance", "Mitra Finance-ஐ அழைக்கவும்"])}
                <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="rdk-faq-list">
              {FAQS.map((faq) => (
                <details key={faq.q[0]}>
                  <summary>
                    {t(faq.q)}
                    <Plus size={18} />
                  </summary>
                  <p>{t(faq.a)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="rdk-contact">
          <div className="rdk-container rdk-contact-grid">
            <div>
              <span className="rdk-eyebrow">
                {t(["YOUR NEXT CHAPTER", "உங்கள் அடுத்த முன்னேற்றம்"])}
              </span>
              <h2>
                {t([
                  "It starts with\na conversation.",
                  "ஒரு உரையாடலில்\nதொடங்கலாம்.",
                ])}
              </h2>
              <p>
                {t([
                  "Tell us what you're planning. Let's explore the possibilities together.",
                  "உங்கள் திட்டத்தை எங்களிடம் கூறுங்கள். வாய்ப்புகளை ஒன்றாக அறியலாம்.",
                ])}
              </p>
              <a
                className="rdk-button rdk-button-lime"
                href={whatsappUrl(
                  "Hello Mitra Finance, I would like to discuss my loan requirements.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                {t(["Chat on WhatsApp", "WhatsApp-இல் பேசுங்கள்"])}
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="rdk-contact-details">
              <a href={BUSINESS.phoneHref}>
                <Phone />
                <span>
                  <small>{t(["GIVE US A CALL", "எங்களை அழைக்கவும்"])}</small>
                  {BUSINESS.phone}
                </span>
              </a>
              <a href={`mailto:${BUSINESS.email}`}>
                <Mail />
                <span>
                  <small>{t(["WRITE TO US", "மின்னஞ்சல் அனுப்புங்கள்"])}</small>
                  {BUSINESS.email}
                </span>
              </a>
              <div>
                <MapPin />
                <span>
                  <small>{t(["COME SAY HELLO", "நேரில் சந்திக்கவும்"])}</small>
                  {t([
                    BUSINESS.address,
                    "169, 2வது மாடி, NVN லேஅவுட், நியூ சித்தாபுதூர், கோயம்புத்தூர் - 641044, தமிழ்நாடு",
                  ])}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppButton />
    </div>
  );
}
