import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./rdk.css";
import { LanguageProvider } from "@/components/rdk/language";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mitra Finance | Personal Loans, Home Loans in Coimbatore, Avinashi, Tirupur",
    template: "%s | Mitra Finance",
  },
  description:
    "Mitra Finance connects you to 100+ banks and NBFCs for personal loans, home loans, loan against property, and OD/CC facilities in Coimbatore, Avinashi, and Tirupur. Fast approvals, transparent rates. Expert guidance in Tamil & English.",
  keywords: [
    "personal loan Coimbatore",
    "home loan Coimbatore",
    "personal loan Avinashi",
    "home loan Tirupur",
    "loan against property Coimbatore",
    "loan against property Avinashi",
    "business loan Coimbatore",
    "business loan Tirupur",
    "OD CC facility",
    "finance company Coimbatore",
    "loan consultant Coimbatore",
    "loan consultant Avinashi",
    "quick loan approval",
    "bank loan Coimbatore",
    "bank loan Avinashi",
    "NBFC loans Tamil Nadu",
    "Mitra Finance",
    "loan agent near me",
    "finance company near Coimbatore",
    "loan near Siddhapudur",
  ],
  authors: [{ name: "Mitra Finance" }],
  creator: "Mitra Finance",
  publisher: "Mitra Finance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mitrafinance.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mitra Finance | Personal Loans, Home Loans in Coimbatore, Avinashi, Tirupur",
    description:
      "Get quick loan approvals with Mitra Finance. Connect to 100+ banks & NBFCs. Personal loans, home loans, LAP, OD/CC in Coimbatore, Avinashi & Tirupur. Expert guidance in Tamil & English.",
    url: "https://mitrafinance.in",
    siteName: "Mitra Finance",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/rdk-logo.png",
        width: 1200,
        height: 630,
        alt: "Mitra Finance - Your Trusted Loan Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitra Finance | Personal Loans, Home Loans in Coimbatore, Avinashi, Tirupur",
    description:
      "Get quick loan approvals with Mitra Finance. Connect to 100+ banks & NBFCs in Coimbatore, Avinashi & Tirupur. Expert guidance in Tamil & English.",
    images: ["/images/rdk-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
  },
  icons: { 
    icon: "/images/rdk-symbol.png",
    apple: "/images/rdk-symbol.png",
    shortcut: "/images/rdk-symbol.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
