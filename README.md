# Glitter Game Day

Marketing site and product catalogue for the Glitter Game Day shop.
Next.js 14 (App Router) + Tailwind, exported as a fully static site.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npx tsc --noEmit     # type check
```

The build has no network dependencies. It will complete offline.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds a static
export and publishes it to the `gh-pages` branch.

There are two serving modes and they need different settings:

| Serving from | Set | Result |
|---|---|---|
| `albertrus.github.io/glitter-game-day` | nothing | assets and links get the `/glitter-game-day` prefix |
| `glittergameday.com` | `CUSTOM_DOMAIN` in the workflow | no prefix, and a `CNAME` file is written |

Switch `CUSTOM_DOMAIN` in the same sitting as the DNS change. Setting it while
DNS still points elsewhere will serve a site whose links all 404.

Analytics is off unless the repository secret `GA_MEASUREMENT_ID` exists. That
is deliberate: turning it on without updating `/policies/privacy` is a problem
in several states.

## Where things live

```
app/                      routes
  page.tsx                home
  shop/                   all products
  collections/[team]/     one page per collection
  products/[slug]/        product detail, buy button
  sizing, care, faq       support content
  policies/               shipping, privacy, terms (unfinished, noindex)
components/               UI
data/products.ts          the product catalogue
data/teams.ts             collection copy, colours, keywords
data/gallery.ts           photo grid
lib/site.ts               URLs, base path, analytics switch
lib/commerce.ts           where the buy button points
scripts/make-og.mjs       regenerates public/og-image.png
```

## Adding or changing a product

Everything is in `data/products.ts`. One entry per product:

```ts
{
  id: "rangers-3",
  slug: "some-url-safe-name",   // becomes /products/some-url-safe-name
  team: "rangers",              // must match an id in data/teams.ts
  name: "Display name",
  price: "$49.99",
  image: "https://... or /products/photo.jpg or null",
  etsyUrl: "https://www.etsy.com/listing/1234567890/...",
  description: "...",
  details: ["...", "..."],
  inStock: true,
}
```

## How the buy button decides where to go

`lib/commerce.ts`, in order of preference:

1. `stripePaymentLink` if present. Create these in the Stripe dashboard under
   Products, then Payment links. A Payment Link is just a URL, so it works
   with the static export and needs no server and no secret key in the repo.
   This is the path that takes checkout off Etsy entirely.
2. `etsyUrl`, but only if it is a real listing URL matching `/listing/<id>`.
3. Otherwise the button renders disabled.

A link to the Etsy shop *root* is deliberately treated as no link at all.
Sending someone who clicked a specific jersey into a shop front where they
have to find it again is the largest avoidable drop-off on a referral site.

Right now no product has a real listing URL, so every buy button is disabled.
Filling those in is the single highest-value change left, and only Albert can
do it because only he knows which listing is which.

## Things that were removed and why

- **Invented ratings and review counts.** `data/products.ts` carried hardcoded
  values (4.9 stars, 34 reviews, "Best Seller") that came from nowhere. They
  rendered as stars and were also emitted as schema.org `aggregateRating`.
  That is a fabricated review claim on a commercial page.
- **Invented statistics.** "500+ Happy Fans" and "5-star Avg. Rating" in the
  about section.
- **An unverified shipping promise.** "Free shipping on orders over $50, ships
  from Texas" was hardcoded in the team sections.
- **Hidden keyword text.** A `sr-only` block repeating search keywords in each
  team section, plus two keyword-pill blocks in the footer. Hidden text is a
  Google spam policy violation and risks the whole domain, not just a page.
- **A hardcoded GA placeholder.** `G-XXXXXXXXXX` was firing on every page load.
- **`next/font/google`.** It fetches from Google at build time, so the build
  failed on any machine without outbound access to fonts.googleapis.com.

## Known gaps

- No product has a real Etsy listing URL yet.
- Six of the twelve products have no photo and render a placeholder.
- The three policy pages are unfinished and are `noindex` until they are.
- Product photos are served from Google Drive share links, which are rate
  limited and break if the sharing setting changes. Move them into
  `public/products/` before any real traffic.
