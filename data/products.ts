export interface Product {
  id: string;
  /** Slug used in the URL: /products/<slug> */
  slug: string;
  team: string;
  name: string;
  /** Display price, e.g. "$49.99". Empty string means "not priced yet". */
  price: string;
  /**
   * Primary image. Either a Google Drive share URL or a path under /public.
   * `null` means no photo exists yet and the placeholder renders instead.
   */
  image: string | null;
  /** Extra photos for the product page gallery. */
  gallery?: string[];
  /**
   * Direct link to the specific Etsy LISTING, not the shop root.
   * Must match /listing/<id> or the buy button stays disabled on purpose.
   */
  etsyUrl?: string;
  /**
   * Optional Stripe Payment Link. Create one per product in the Stripe
   * dashboard (Products -> Payment links) and paste the URL here to take
   * checkout directly instead of routing through Etsy. Works with the static
   * export because a Payment Link is just a hosted URL, no server needed.
   */
  stripePaymentLink?: string;
  description?: string;
  /** Short list of concrete facts shown on the product page. */
  details?: string[];
  inStock?: boolean;
}

/**
 * NOTE ON REVIEWS AND RATINGS
 * This file previously carried hardcoded `rating` and `reviews` numbers
 * (4.9 / 34 reviews, "Best Seller", and so on) that were not pulled from
 * anywhere. They were rendered as star ratings AND emitted as schema.org
 * aggregateRating JSON-LD. That is a fabricated review claim on a commercial
 * page. It has been removed. Real review counts belong on the Etsy listing,
 * where they are actually earned, and can be surfaced here later via the
 * Etsy API if it is worth the effort.
 */

export const products: Product[] = [
  {
    id: "astros-1",
    slug: "astros-sequin-game-day-jersey",
    team: "astros",
    name: "Sequin Game Day Jersey, Navy and Orange",
    price: "$49.99",
    image: "https://lh3.googleusercontent.com/d/19sRxrnpDGmIceg5W3f92mW5B4HD7crde",
    description:
      "A full-sequin button-front baseball jersey in navy with orange trim. Oversized boyfriend cut, meant to be worn over a tank with shorts or jeans.",
    details: [
      "All-over sequin front and back",
      "Button-front baseball silhouette",
      "Relaxed oversized fit",
      "Hand wash cold, lay flat to dry",
    ],
    inStock: true,
  },
  {
    id: "astros-2",
    slug: "space-city-glitter-top",
    team: "astros",
    name: "Space City Glitter Top",
    price: "$44.99",
    image: "https://lh3.googleusercontent.com/d/1AwZazv6erMeM1xUjoDwkMF8hxvATdAS4",
    description:
      "A lighter glitter top in navy and orange for days when a full sequin jersey is too much.",
    details: ["Glitter print", "Relaxed fit", "Hand wash cold"],
    inStock: true,
  },
  {
    id: "rangers-1",
    slug: "lone-star-blue-sequin-jersey",
    team: "rangers",
    name: "Lone Star Blue Sequin Jersey",
    price: "$49.99",
    image: null,
    description:
      "Full-sequin button-front jersey in royal blue with red trim.",
    details: [
      "All-over sequin front and back",
      "Button-front baseball silhouette",
      "Relaxed oversized fit",
      "Hand wash cold, lay flat to dry",
    ],
    inStock: true,
  },
  {
    id: "rangers-2",
    slug: "arlington-glitter-game-day-shirt",
    team: "rangers",
    name: "Arlington Glitter Game Day Shirt",
    price: "$42.99",
    image: null,
    details: ["Glitter print", "Relaxed fit", "Hand wash cold"],
    inStock: true,
  },
  {
    id: "texans-1",
    slug: "battle-red-sequin-jersey",
    team: "texans",
    name: "Deep Steel and Red Sequin Jersey",
    price: "$52.99",
    image: null,
    details: [
      "All-over sequin front and back",
      "Relaxed oversized fit",
      "Hand wash cold, lay flat to dry",
    ],
    inStock: true,
  },
  {
    id: "texans-2",
    slug: "houston-football-glitter-top",
    team: "texans",
    name: "Houston Football Glitter Top",
    price: "$46.99",
    image: null,
    details: ["Glitter print", "Relaxed fit", "Hand wash cold"],
    inStock: true,
  },
  {
    id: "cowboys-1",
    slug: "silver-star-sequin-jersey",
    team: "cowboys",
    name: "Navy and Silver Sequin Jersey",
    price: "$54.99",
    image: null,
    details: [
      "All-over sequin front and back",
      "Relaxed oversized fit",
      "Hand wash cold, lay flat to dry",
    ],
    inStock: true,
  },
  {
    id: "cowboys-2",
    slug: "dallas-glitter-game-day-top",
    team: "cowboys",
    name: "Dallas Glitter Game Day Top",
    price: "$48.99",
    image: null,
    details: ["Glitter print", "Relaxed fit", "Hand wash cold"],
    inStock: true,
  },
  {
    id: "rockets-1",
    slug: "red-hot-sequin-jersey",
    team: "rockets",
    name: "Red Hot Sequin Jersey",
    price: "$47.99",
    image: "https://lh3.googleusercontent.com/d/1DugKhPoJjtSXZ3mOMrEPUUx7GQIQ2qJo",
    details: [
      "All-over sequin front and back",
      "Relaxed oversized fit",
      "Hand wash cold, lay flat to dry",
    ],
    inStock: true,
  },
  {
    id: "rockets-2",
    slug: "h-town-hoops-glitter-top",
    team: "rockets",
    name: "H-Town Hoops Glitter Top",
    price: "$43.99",
    image: "https://lh3.googleusercontent.com/d/1TVnhLinsJTLLgrUPRFbi7LoZiJNHlaPr",
    details: ["Glitter print", "Relaxed fit", "Hand wash cold"],
    inStock: true,
  },
  {
    id: "spurs-1",
    slug: "silver-edition-sequin-jersey",
    team: "spurs",
    name: "Black and Silver Sequin Jersey",
    price: "$49.99",
    image: "https://lh3.googleusercontent.com/d/1YqjflFi8cISwm7lG21Bu8hQfNPkOlr3A",
    details: [
      "All-over sequin front and back",
      "Relaxed oversized fit",
      "Hand wash cold, lay flat to dry",
    ],
    inStock: true,
  },
  {
    id: "spurs-2",
    slug: "san-antonio-glitter-game-day-shirt",
    team: "spurs",
    name: "San Antonio Glitter Game Day Shirt",
    price: "$44.99",
    image: "https://lh3.googleusercontent.com/d/1EOdHg_8D1_aQT1vgUAf9gqScCREftZWI",
    details: ["Glitter print", "Relaxed fit", "Hand wash cold"],
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByTeam(teamId: string): Product[] {
  return products.filter((p) => p.team === teamId);
}
