import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/android-icon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/android-icon-48x48.png", sizes: "48x48", type: "image/png" }],
    shortcut: ["/favicon.png"],
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
      email: "iam@rks.ad",
      description,
      areaServed: [
        { "@type": "City", name: "Jaipur" },
        { "@type": "State", name: "Rajasthan" },
        { "@type": "Country", name: "India" },
      ],
      sameAs: [SITE.url],
      slogan: SITE.tagline,
      knowsAbout: [
        "Best advocate in Jaipur",
        "Best advocate in Rajasthan",
        "Best advocate in India",
        "Best vakil nearby",
        "Famous advocate nearby",
        "Criminal lawyer",
        "Civil advocate",
        "Family lawyer",
        "Property dispute advocate",
        "High Court advocate Jaipur",
      ],
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
        target: SITE.url,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: SITE.url,
      name: title,
      description,
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${manrope.variable} ${syne.variable} h-full overflow-hidden`}>
      <body className="h-full overflow-hidden antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
