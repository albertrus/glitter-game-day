import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import NavBar from "@/components/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://glittergameday.com"),
  title: {
    default:
      "Glitter Game Day — Women's Sequin Jerseys for Texas Sports Teams",
    template: "%s | Glitter Game Day",
  },
  description:
    "Shop women's sequin and glitter jerseys for every major Texas sports team — Astros, Rangers, Texans, Cowboys, Rockets, and Spurs. Built for the stands. Made to sparkle. Ships from Texas.",
  keywords: [
    "women's sequin jersey Texas",
    "game day fashion women",
    "glitter sports jersey",
    "Houston Astros women jersey",
    "Texas Rangers sequin shirt",
    "Houston Texans women jersey",
    "Dallas Cowboys glitter jersey",
    "Houston Rockets women top",
    "San Antonio Spurs women jersey",
    "Texas sports fan outfit",
    "Etsy sequin jersey Texas",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://glittergameday.com",
    siteName: "Glitter Game Day",
    title: "Glitter Game Day — Women's Sequin Jerseys for Texas Sports Teams",
    description:
      "Sequin jerseys for every Texas team. Built for the stands. Made to sparkle.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glitter Game Day — Women's Sequin Jerseys for Texas Sports Teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glitter Game Day — Women's Sequin Jerseys for Texas Sports Teams",
    description:
      "Sequin jerseys for every Texas team. Built for the stands. Made to sparkle.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://glittergameday.com",
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
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Glitter Game Day",
  url: "https://glittergameday.com",
  description:
    "Women's sequin and glitter jerseys for Texas sports teams. Shop on Etsy.",
  sameAs: ["https://www.etsy.com/shop/GlitterGameDay"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "English",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Glitter Game Day",
  url: "https://glittergameday.com",
  description: "Women's sequin jerseys for every Texas sports team",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://glittergameday.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
