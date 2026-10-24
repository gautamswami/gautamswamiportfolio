import { Space_Grotesk } from "next/font/google";
import {
  CONTACT,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  getSiteUrl,
} from "@/lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | Full-Stack Developer & Product Engineer`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Full-Stack Developer & Product Engineer`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Full-Stack Developer & Product Engineer`,
    description: SITE_TAGLINE,
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
    google: "S28GD9P7ZkrP7egUvBgOKzc34Jw2eIu6TsE5rCJ5m7o",
  },
  other: {
    "geo.region": "IN",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#12081f" },
    { media: "(prefers-color-scheme: dark)", color: "#12081f" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: CONTACT.name,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    jobTitle: CONTACT.jobTitle,
    description: SITE_DESCRIPTION,
    email: CONTACT.email,
    telephone: CONTACT.phoneHref.replace("tel:", ""),
    sameAs: CONTACT.sameAs,
    knowsAbout: [
      "Full-stack development",
      "Mobile app development",
      "AI automation",
      "SaaS products",
      "Product design",
      "Web applications",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${siteUrl}/#person` },
    inLanguage: "en",
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#service`,
    name: `${SITE_NAME} — Product Engineering`,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    image: `${siteUrl}/opengraph-image`,
    telephone: CONTACT.phoneHref.replace("tel:", ""),
    email: CONTACT.email,
    areaServed: "Worldwide",
    priceRange: "$$",
    founder: { "@id": `${siteUrl}/#person` },
    sameAs: CONTACT.sameAs,
    serviceType: [
      "Full-stack development",
      "Mobile app development",
      "AI automation",
      "SaaS development",
      "Product design",
    ],
  };

  const payload = [person, website, professionalService];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
