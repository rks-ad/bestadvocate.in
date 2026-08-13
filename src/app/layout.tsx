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
  "Best Advocate in Jaipur, Rajasthan & India | Best Vakil & Lawyer Nearby";
const description =
  "Submit your case to Best Advocate — trusted legal help in Jaipur, Rajasthan and across India. Best advocate nearby, best lawyer nearby, best vakil nearby, famous advocate nearby, and expert criminal, civil, family, property and High Court lawyers ready to call you back.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description,
  applicationName: SITE.name,
  keywords: [
    // Core nearby / near me intent — hidden SEO only, not rendered on page
    "best advocate nearby",
    "best advocate near me",
    "best advocate in Jaipur",
    "best advocate in Rajasthan",
    "best advocate in India",
    "best lawyer nearby",
    "best lawyer near me",
    "best lawyer in Jaipur",
    "best lawyer in Rajasthan",
    "best lawyer in India",
    "best vakil nearby",
    "best vakil near me",
    "best vakil in Jaipur",
    "best vakil in Rajasthan",
    "famous advocate nearby",
    "famous lawyer nearby",
    "famous vakil nearby",
    "top advocate Jaipur",
    "top advocate in Rajasthan",
    "top advocate in India",
    "top lawyer Jaipur",
    "top lawyer near me",
    "top vakil Jaipur",
    "advocate near me",
    "lawyer near me",
    "vakil near me",
    "wakeel near me",
    "wakeel in Jaipur",
    "advocate in Jaipur",
    "advocate in Rajasthan",
    "lawyer in Jaipur",
    "lawyer in Rajasthan",
    "vakil in Jaipur",
    "vakil in Rajasthan",
    // Practice-area + court intent
    "criminal lawyer Jaipur",
    "criminal advocate Jaipur",
    "civil advocate Rajasthan",
    "civil lawyer Jaipur",
    "family lawyer Jaipur",
    "divorce lawyer Jaipur",
    "property lawyer Jaipur",
    "property dispute advocate Jaipur",
    "corporate lawyer Jaipur",
    "labour lawyer Jaipur",
    "consumer court lawyer Jaipur",
    "cyber crime lawyer Jaipur",
    "tax lawyer Jaipur",
    "bail lawyer Jaipur",
    "cheque bounce lawyer Jaipur",
    "High Court advocate Jaipur",
    "High Court lawyer Rajasthan",
    "Rajasthan High Court vakil",
    "Jaipur High Court lawyer",
    "Supreme Court advocate India",
    "District Court lawyer Jaipur",
    "Sessions Court lawyer Jaipur",
    // Locality + affordability signals
    "affordable advocate Jaipur",
    "experienced lawyer Jaipur",
    "expert advocate Jaipur",
    "advocate in Vaishali Nagar Jaipur",
    "advocate in Malviya Nagar Jaipur",
    "advocate in Mansarovar Jaipur",
    "advocate in Tonk Road Jaipur",
    "advocate in C-Scheme Jaipur",
    "advocate in Jagatpura Jaipur",
    "lawyer in Vaishali Nagar",
    "vakil in Mansarovar",
    "lawyer in Malviya Nagar Jaipur",
    // Brand + language variants
    "bestadvocate.in",
    "best advocate",
    "best lawyer",
    "advokat Jaipur",
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
      email: "help@bestadvocate.in",
      description,
      areaServed: [
        { "@type": "City", name: "Jaipur" },
        { "@type": "State", name: "Rajasthan" },
        { "@type": "Country", name: "India" },
      ],
      sameAs: [SITE.url],
      slogan: SITE.tagline,
      knowsAbout: [
        "Best advocate nearby",
        "Best advocate near me",
        "Best advocate in Jaipur",
        "Best advocate in Rajasthan",
        "Best advocate in India",
        "Best lawyer nearby",
        "Best lawyer near me",
        "Best lawyer in Jaipur",
        "Best vakil nearby",
        "Best vakil near me",
        "Famous advocate nearby",
        "Famous lawyer nearby",
        "Top advocate Jaipur",
        "Advocate near me",
        "Lawyer near me",
        "Vakil near me",
        "Criminal lawyer Jaipur",
        "Civil advocate Rajasthan",
        "Family lawyer Jaipur",
        "Divorce lawyer Jaipur",
        "Property dispute advocate Jaipur",
        "Corporate lawyer Jaipur",
        "Labour lawyer Jaipur",
        "Consumer court lawyer Jaipur",
        "Cyber crime lawyer Jaipur",
        "Tax lawyer Jaipur",
        "Bail lawyer Jaipur",
        "High Court advocate Jaipur",
        "Rajasthan High Court vakil",
        "Supreme Court advocate India",
        "District Court lawyer Jaipur",
        "Advocate in Vaishali Nagar Jaipur",
        "Advocate in Mansarovar Jaipur",
        "Affordable advocate Jaipur",
        "Experienced lawyer Jaipur",
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
    <html lang="en-IN" className={`${manrope.variable} ${syne.variable} h-full`}>
      <body className="h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
