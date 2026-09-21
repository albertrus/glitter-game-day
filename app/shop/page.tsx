import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { products } from "@/data/products";
import { teams } from "@/data/teams";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop All Sequin Jerseys",
  description:
    "Every sequin and glitter game day piece in one place. Hand-finished, relaxed fit, made to be seen from the upper deck.",
  alternates: { canonical: absoluteUrl("/shop") },
};

export default function ShopPage() {
  const teamById = new Map(teams.map((t) => [t.id, t]));

  return (
    <>
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Shop everything
          </h1>
          <p className="text-white/60 mb-10 max-w-2xl">
            {products.length} pieces. Every one is hand-finished, cut relaxed,
            and built to hold up to a full day in the stands.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {teams.map((team) => (
              <a
                key={team.id}
                href={`/collections/${team.id}`}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-colors"
              >
                {team.city} {team.sport}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const team = teamById.get(product.team);
              if (!team) return null;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  team={team}
                  priority={i < 4}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
