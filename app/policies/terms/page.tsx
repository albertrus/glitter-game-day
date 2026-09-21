import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import NeedsInput from "@/components/NeedsInput";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Glitter Game Day website.",
  alternates: { canonical: absoluteUrl("/policies/terms") },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <PageShell title="Terms">
      <NeedsInput what="business entity and governing law">
        <p>
          The legal name selling these goods and which state&apos;s law
          applies. You are in Arizona and the brand reads as Texas, so this is
          a real choice, not boilerplate.
        </p>
      </NeedsInput>

      <NeedsInput what="product description accuracy">
        <p>
          Standard language that colours vary between screens and that
          hand-finished pieces vary slightly.
        </p>
      </NeedsInput>

      <NeedsInput what="affiliation disclaimer">
        <p>
          A disclaimer in the footer does not create a right to use marks you
          do not have a licence for. See the trademark notes in the project
          vault before writing this section.
        </p>
      </NeedsInput>
    </PageShell>
  );
}
