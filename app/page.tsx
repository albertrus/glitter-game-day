import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TeamSection from "@/components/TeamSection";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { teams } from "@/data/teams";
import { getProductsByTeam } from "@/data/products";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {teams.map((team) => (
        <TeamSection
          key={team.id}
          team={team}
          products={getProductsByTeam(team.id)}
        />
      ))}

      <GallerySection />
      <AboutSection />
      <Footer />
    </>
  );
}
