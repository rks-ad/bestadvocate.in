import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const title =
  "Best Advocate in Jaipur, Rajasthan & India | Best Vakil Nearby";
const description =
  "Submit your case to Best Advocate — trusted legal help in Jaipur, Rajasthan and across India. Best vakil nearby, famous advocate nearby, and expert lawyers ready to call you back.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description,
  applicationName: SITE.name,
  keywords: [
    "best advocate in Jaipur",
    "best advocate in Rajasthan",
    "best advocate in India",
    "best vakil nearby",
    "famous advocate nearby",
    "best lawyer near me",
    "top advocate Jaipur",
    "criminal lawyer Jaipur",
    "civil advocate Rajasthan",
    "family lawyer Jaipur",
    "property lawyer Jaipur",
    "High Court advocate Jaipur",
    "best advocate near me",
    "vakil in Jaipur",
    "lawyer in Rajasthan",
    "bestadvocate.in",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title,
    description,
    images: [
      {
        url: SITE.logoUrl,
        width: 750,
        height: 750,
        alt: "Best Advocate logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [SITE.logoUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "legal services",
  icons: {
    icon: [{ url: "/bestadvocatelogo.png", type: "image/png" }],
    apple: [{ url: "/bestadvocatelogo.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LegalService",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: SITE.logoUrl,
      image: SITE.logoUrl,
      email: "help@bestadvocate.in",
      description,
      areaServed: [
        { "@type": "City", name: "Jaipur" },
        { "@type": "State", name: "Rajasthan" },
        { "@type": "Country", name: "India" },
      ],
      sameAs: [SITE.url],
      slogan: SITE.tagline,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "CommunicateAction",
        name: "Submit case enquiry",
        target: `${SITE.url}/#case-form`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I contact the best advocate in Jaipur?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Submit your name, mobile, email, and case details on bestadvocate.in. After email OTP verification, our team calls you back.",
          },
        },
        {
          "@type": "Question",
          name: "Do you help with advocates across Rajasthan and India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Best Advocate handles enquiries for Jaipur, Rajasthan, and clients seeking trusted legal support across India.",
          },
        },
        {
          "@type": "Question",
          name: "Can I attach case documents?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You may attach PDFs, images, or Word documents with your enquiry so our team can review context before calling.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
