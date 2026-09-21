import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import NeedsInput from "@/components/NeedsInput";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping and Returns",
  description: "Shipping times, costs and the returns policy for Glitter Game Day.",
  alternates: { canonical: absoluteUrl("/policies/shipping-returns") },
  robots: { index: false, follow: true },
};

export default function ShippingReturnsPage() {
  return (
    <PageShell title="Shipping and returns">
      <p>
        Orders placed through Etsy are covered by the shipping profile and
        return policy set on that listing. What follows applies to orders
        placed directly on this site.
      </p>

      <NeedsInput what="processing time">
        <p>
          How many business days between an order coming in and it leaving your
          hands. Be honest, and pad it. Etsy ranks on on-time delivery, and
          quoting 1 to 2 days and shipping on day 5 costs more than quoting 3
          to 5 and shipping on day 3.
        </p>
      </NeedsInput>

      <NeedsInput what="shipping cost and carrier">
        <p>
          Free shipping or flat rate, which carrier, and whether you offer an
          expedited option before a specific game date.
        </p>
      </NeedsInput>

      <NeedsInput what="return window and conditions">
        <p>
          How many days a customer has, who pays return postage, whether items
          have to be unworn with tags on, and whether custom or personalised
          pieces are final sale. If you sell into a state with its own
          refund-disclosure rules, this is the text that has to be right.
        </p>
      </NeedsInput>

      <NeedsInput what="damaged or wrong item">
        <p>
          What a customer does and how fast you respond. This one paragraph
          prevents most negative reviews.
        </p>
      </NeedsInput>

      <p className="text-sm text-white/40">
        This page is excluded from search indexing until it is filled in.
      </p>
    </PageShell>
  );
}
