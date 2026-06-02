import Hero from "@/components/Hero";
import TeamSection from "@/components/TeamSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { teams } from "@/data/teams";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <Hero />

      {teams.map((team) => {
        const teamProducts = products.filter((p) => p.team === team.id);
        return (
          <TeamSection key={team.id} team={team} products={teamProducts} />
        );
      })}

      <AboutSection />
      <Footer />
    </>
  );
}
