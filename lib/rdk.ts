export const BUSINESS = {
  name: "Mitra Finance",
  phone: "+91 88705 34301",
  phoneHref: "tel:+918870534301",
  whatsapp: "918870534301",
  email: "mitra.finance0206@gmail.com",
  address: "169, 2nd Floor, NVN Layout, New Siddhapudur, Coimbatore - 641044, Tamil Nadu",
  socialHandle: "mitra_finance",
} as const;

export type Language = "en" | "ta";
export type Bilingual = readonly [string, string];
export const localize = (text: Bilingual, language: Language) =>
  text[language === "ta" ? 1 : 0];

export const PRODUCTS = [
  {
    id: "personal",
    name: ["Personal loan", "தனிநபர் கடன்"],
    description: [
      "A little support for life's bigger plans.",
      "உங்கள் வாழ்க்கைத் திட்டங்களுக்கு நிதி உதவி.",
    ],
    eligibility: [
      "For applicants with bank-credited salary above ₹20,000 per month.",
      "வங்கிக் கணக்கில் மாதச் சம்பளம் ₹20,000-க்கு மேல் பெறுபவர்களுக்கு.",
    ],
    icon: "person",
  },
  {
    id: "home",
    name: ["Home loan", "வீட்டுக் கடன்"],
    description: [
      "Make the place you call home your own.",
      "உங்கள் சொந்த வீட்டுக் கனவை நனவாக்குங்கள்.",
    ],
    eligibility: [
      "For bank-credited salary, cash salary and self-employed applicants.",
      "வங்கிச் சம்பளம், ரொக்கச் சம்பளம் பெறுபவர்கள் மற்றும் சுயதொழில் செய்பவர்களுக்கு.",
    ],
    icon: "home",
  },
  {
    id: "property",
    name: ["Loan against property", "சொத்து அடமானக் கடன்"],
    description: [
      "Explore the possibilities in your property's value.",
      "உங்கள் சொத்தின் மதிப்பைக் கொண்டு நிதி வாய்ப்புகளை அறியுங்கள்.",
    ],
    eligibility: [
      "Salaried and self-employed applicants. Ask about LTV above 70%, subject to lender assessment and property valuation.",
      "சம்பளம் பெறுபவர்கள் மற்றும் சுயதொழில் செய்பவர்களுக்கு. 70%-க்கு மேலான LTV வாய்ப்புகள் வங்கியின் மதிப்பீடு மற்றும் சொத்து மதிப்பைப் பொறுத்தவை.",
    ],
    icon: "property",
  },
  {
    id: "od_cc",
    name: ["Overdraft / Cash credit", "ஓவர்டிராஃப்ட் / கேஷ் கிரெடிட்"],
    description: [
      "Keep your business moving with working capital.",
      "உங்கள் தொழிலுக்குத் தேவையான நடைமுறை மூலதனம்.",
    ],
    eligibility: [
      "Speak with our team about OD / CC eligibility, limits and terms for your business.",
      "உங்கள் தொழிலுக்கான OD / CC தகுதி, வரம்புகள் மற்றும் விதிமுறைகளை எங்கள் குழுவிடம் அறியுங்கள்.",
    ],
    icon: "business",
  },
] as const;

export const TENURE_MONTHS = [6, 12, 24, 36, 60, 84, 120, 180, 240, 300];

export function whatsappUrl(message: string) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
