import type { Metadata } from "next";
import Script from "next/script";
import NavBar from "@/components/NavBar";
import { SITE_URL, GA_ID, asset, absoluteUrl, ETSY_SHOP_URL } from "@/lib/site";
import "./globals.css";

/**
 * Fonts are loaded from a system stack in globals.css rather than
 * next/font/google. next/font/google fetches from fonts.googleapis.com at
 * BUILD time, which means the build fails on any machine or CI runner without
 * outbound access to Google, and it adds a render-blocking dependency for
 * every visitor. The system stack renders instantly and never fails to build.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Glitter Game Day — Women's Sequin Game Day Jerseys",
    template: "%s | Glitter Game Day",
  },
  description:
    "Hand-finished sequin and glitter jerseys for women, made for game day in Texas. Built for the stands. Made to sparkle.",
  keywords: [
    "women's sequin jersey",
    "glitter jersey women",
    "game day outfit women",
    "sequin baseball jersey",
    "game day fashion Texas",
    "sequin top for her",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: "Glitter Game Day",
    title: "Glitter Game Day — Women's Sequin Game Day Jerseys",
    description:
      "Hand-finished sequin and glitter jerseys for women. Built for the stands. Made to sparkle.",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Glitter Game Day — women's sequin game day jerseys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glitter Game Day — Women's Sequin Game Day Jerseys",
    description:
      "Hand-finished sequin and glitter jerseys for women. Built for the stands. Made to sparkle.",
    images: [absoluteUrl("/og-image.png")],
  },
  icons: {
    icon: asset("/favicon.svg"),
  },
  alternates: {
    canonical: absoluteUrl("/"),
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
  url: absoluteUrl("/"),
  description: "Women's sequin and glitter game day jerseys.",
  sameAs: [ETSY_SHOP_URL],
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
      </head>
      <body className="bg-black text-white antialiased font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-full focus:bg-white focus:text-black focus:font-bold"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main">{children}</main>

        {/* Analytics only loads when a real measurement ID is configured. */}
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
