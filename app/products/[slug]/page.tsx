import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import { products, getProductBySlug, getProductsByTeam } from "@/data/products";
import { teams } from "@/data/teams";
import { resolveBuy, priceToNumber } from "@/lib/commerce";
import { absoluteUrl, ETSY_SHOP_URL } from "@/lib/site";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} from Glitter Game Day. Hand-finished sequin game day wear.`,
    alternates: { canonical: absoluteUrl(`/products/${product.slug}`) },
    openGraph: {
      title: product.name,
      description: product.description || product.name,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default function ProductPage({ params }: Params) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const team = teams.find((t) => t.id === product.team);
  if (!team) notFound();

  const buy = resolveBuy(product);
  const priceValue = priceToNumber(product.price);

  const related = getProductsByTeam(team.id)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  /**
   * Product JSON-LD. No aggregateRating: there are no verified reviews on
   * this site, and emitting invented ones is both a Google structured-data
   * violation and a false advertising claim. Offers are only declared when
   * there is a real buy URL, otherwise the offer block is omitted.
   */
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    ...(product.image ? { image: [product.image] } : {}),
    brand: { "@type": "Brand", name: "Glitter Game Day" },
  };

  if (buy.kind !== "unavailable" && priceValue) {
    jsonLd.offers = {
      "@type": "Offer",
      price: priceValue.toFixed(2),
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: buy.url,
      seller: { "@type": "Organization", name: "Glitter Game Day" },
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              {
                label: `${team.city} ${team.sport}`,
                href: `/collections/${team.id}`,
              },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
            {/* Gallery */}
            <div className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <ProductImage
                src={product.image}
                alt={product.name}
                team={team}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Buy panel */}
            <div>
              <Link
                href={`/collections/${team.id}`}
                className="inline-block px-2.5 py-1 rounded text-xs font-semibold mb-4 transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: `${team.colors.secondary}30`,
                  color: team.sparkleColor,
                  border: `1px solid ${team.sparkleColor}40`,
                }}
              >
                {team.city} {team.sport}
              </Link>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                {product.name}
              </h1>

              <p
                className="text-3xl font-bold mb-6"
                style={{ color: team.sparkleColor }}
              >
                {product.price || "Price coming soon"}
              </p>

              {product.description ? (
                <p className="text-white/70 leading-relaxed mb-6">
                  {product.description}
                </p>
              ) : null}

              {buy.kind === "unavailable" ? (
                <div className="mb-6">
                  <span className="block w-full sm:w-auto text-center px-8 py-4 rounded-full font-bold bg-white/10 text-white/40 cursor-not-allowed">
                    {buy.label}
                  </span>
                  <p className="text-xs text-white/40 mt-3">
                    This piece does not have a live listing yet. Browse the{" "}
                    <a
                      href={ETSY_SHOP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      full Etsy shop
                    </a>{" "}
                    in the meantime.
                  </p>
                </div>
              ) : (
                <a
                  href={buy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full sm:w-auto sm:inline-block text-center px-10 py-4 rounded-full font-bold text-black mb-6 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${team.colors.secondary}, ${team.sparkleColor})`,
                  }}
                >
                  {buy.label} &rarr;
                </a>
              )}

              {product.details?.length ? (
                <ul className="space-y-2 border-t border-white/10 pt-6 mb-6">
                  {product.details.map((d) => (
                    <li
                      key={d}
                      className="flex gap-2 text-sm text-white/70 leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        style={{ color: team.sparkleColor }}
                      >
                        &#10022;
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="flex flex-wrap gap-4 text-xs text-white/50 border-t border-white/10 pt-6">
                <Link href="/sizing" className="underline hover:text-white">
                  Sizing guide
                </Link>
                <Link href="/care" className="underline hover:text-white">
                  Care instructions
                </Link>
                <Link
                  href="/policies/shipping-returns"
                  className="underline hover:text-white"
                >
                  Shipping and returns
                </Link>
              </div>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-20">
              <h2 className="text-2xl font-bold mb-6">More from this collection</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} team={team} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}
