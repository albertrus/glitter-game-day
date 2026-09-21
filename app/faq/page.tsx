import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about fit, care, shipping and custom orders.",
  alternates: { canonical: absoluteUrl("/faq") },
};

const faqs = [
  {
    q: "How do these fit?",
    a: "Oversized. Most people take their usual size and get a relaxed fit that sits past the hip. Size down if you want it closer to the body. Full measurements are on the sizing page.",
  },
  {
    q: "Can I wash it?",
    a: "Yes, cold and gentle, inside out, laid flat to dry. Never in the dryer. The care page has the full rundown.",
  },
  {
    q: "Will the sequins fall off?",
    a: "A few might over a season of wear. They are sewn in a chain, so if one works loose, pull the thread through to the inside and knot it rather than cutting it.",
  },
  {
    q: "Do you take custom orders?",
    a: "Names and numbers can be added to most pieces. Message through the Etsy shop with what you want and how soon you need it.",
  },
  {
    q: "How fast does it ship?",
    a: "Listed on each Etsy listing. If you need something before a specific game, say so when you order and it can usually be worked out.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageShell title="Questions">
        <dl className="space-y-8">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="text-white font-bold text-lg mb-2">{f.q}</dt>
              <dd className="text-white/70 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="pt-6 text-sm text-white/50">
          Still stuck? See <Link href="/sizing" className="underline hover:text-white">sizing</Link>{" "}
          or <Link href="/care" className="underline hover:text-white">care</Link>.
        </p>
      </PageShell>
    </>
  );
}
