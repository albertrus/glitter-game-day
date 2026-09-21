import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { teams } from "@/data/teams";
import { getProductsByTeam } from "@/data/products";
import { absoluteUrl } from "@/lib/site";

interface Params {
  params: { team: string };
}

export function generateStaticParams() {
  return teams.map((t) => ({ team: t.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const team = teams.find((t) => t.id === params.team);
  if (!team) return { title: "Collection not found" };
  return {
    title: team.headline,
    description: team.copy,
    alternates: { canonical: absoluteUrl(`/collections/${team.id}`) },
  };
}

export default function CollectionPage({ params }: Params) {
  const team = teams.find((t) => t.id === params.team);
  if (!team) notFound();

  const teamProducts = getProductsByTeam(team.id);

  return (
    <>
      <section
        className={`pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b ${team.gradient}`}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: `${team.city} ${team.sport}` },
            ]}
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            {team.headline}
          </h1>
          <p
            className="text-lg font-semibold mb-4"
            style={{ color: team.sparkleColor }}
          >
            {team.subheadline}
          </p>
          <p className="text-white/70 max-w-2xl leading-relaxed mb-10">
            {team.copy}
          </p>

          {teamProducts.length === 0 ? (
            <p className="text-white/50">
              Nothing listed in this collection yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  team={team}
                  priority={i < 3}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
