import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import NeedsInput from "@/components/NeedsInput";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Glitter Game Day handles visitor and customer data.",
  alternates: { canonical: absoluteUrl("/policies/privacy") },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy">
      <p>
        This site does not collect names, addresses or payment details. Orders
        are completed on Etsy or on Stripe&apos;s hosted checkout, and those
        companies handle that data under their own policies.
      </p>

      <NeedsInput what="analytics disclosure">
        <p>
          Google Analytics is wired up but only runs when a measurement ID is
          configured. If you turn it on, this page has to say that you use it,
          what it collects, and how someone opts out. If you sell to anyone in
          California, Colorado, Virginia, Connecticut or the EU, that
          disclosure is not optional.
        </p>
      </NeedsInput>

      <NeedsInput what="email list">
        <p>
          If you start collecting email addresses, say where they are stored,
          what you send, and how to unsubscribe.
        </p>
      </NeedsInput>

      <NeedsInput what="contact address">
        <p>
          A working email address someone can use to ask you to delete their
          data. A privacy page with no contact route is not a privacy page.
        </p>
      </NeedsInput>

      <p className="text-sm text-white/40">
        Not legal advice. Worth thirty minutes with someone who does this for a
        living before you publish it.
      </p>
    </PageShell>
  );
}
