import type { Product } from "@/data/products";
import { ETSY_SHOP_URL } from "./site";

export type BuyState =
  | { kind: "stripe"; url: string; label: string }
  | { kind: "etsy"; url: string; label: string }
  | { kind: "unavailable"; label: string };

/**
 * Resolves where the buy button sends a customer.
 *
 * Order of preference:
 *  1. A Stripe Payment Link on the product (direct checkout, Albert keeps the
 *     full margin, works with the static export because it is just a URL).
 *  2. A real Etsy listing URL for that specific product.
 *  3. Nothing. The button is disabled rather than sending people to a shop
 *     root where they have to hunt for the item they just clicked.
 *
 * A link to the Etsy SHOP ROOT does not count as a product link. Sending a
 * customer who clicked "Rangers Sequin Jersey" to a 40-item shop front is the
 * single biggest conversion leak a referral site can have, so it is treated
 * here as "no link yet".
 */
export function resolveBuy(product: Product): BuyState {
  if (product.stripePaymentLink) {
    return {
      kind: "stripe",
      url: product.stripePaymentLink,
      label: "Buy now",
    };
  }

  const etsy = product.etsyUrl?.trim();
  const isRealListing =
    !!etsy &&
    etsy !== ETSY_SHOP_URL &&
    /\/listing\/\d+/.test(etsy);

  if (isRealListing) {
    return { kind: "etsy", url: etsy!, label: "Shop on Etsy" };
  }

  return { kind: "unavailable", label: "Listing coming soon" };
}

export function priceToNumber(price: string): number | null {
  const n = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}
