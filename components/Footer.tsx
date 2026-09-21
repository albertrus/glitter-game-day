import Link from "next/link";
import { teams } from "@/data/teams";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const keywords = [
    "women's sequin jerseys Texas",
    "game day fashion Houston",
    "glitter sports jerseys women",
    "Texas sports fan outfits",
    "sequin baseball jersey women",
    "NFL game day glitter top",
    "NBA women's sparkle jersey",
    "Houston sports fashion",
    "Dallas Cowboys women glitter",
    "San Antonio Spurs women fashion",
    "sequin jersey gift for her",
    "women's sports fan clothing",
  ];

  return (
    <footer className="bg-[#080808] border-t border-white/10">
      {/* Brand strip */}
      <div
        className="py-12 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, #1a0020 0%, #000820 50%, #1a0020 100%)",
        }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Glitter{" "}
          <span className="bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent">
            Game Day
          </span>
        </h2>
        <p className="text-white/60 text-sm mb-6">
          Where fandom meets fashion. ✦ Sequin jerseys for every Texas team.
        </p>
        <a
          href="https://www.etsy.com/shop/GlitterGameDay"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold hover:opacity-90 transition-opacity"
        >
          Shop the Full Collection on Etsy →
        </a>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Shop by team */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Shop by Team
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {teams.map((team) => (
                <a
                  key={team.id}
                  href={`#${team.id}`}
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: team.sparkleColor }}
                  />
                  {team.name} Jerseys
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="https://www.etsy.com/shop/GlitterGameDay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Etsy Store
                </a>
              </li>
              <li>
                <span className="text-white/30 text-sm">Sizing Guide</span>
              </li>
              <li>
                <span className="text-white/30 text-sm">Care Instructions</span>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Texas Cities
            </h3>
            <ul className="space-y-2">
              {["Houston", "Dallas", "San Antonio", "Arlington", "Fort Worth"].map(
                (city) => (
                  <li key={city}>
                    <span className="text-white/60 text-sm">{city}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* SEO keyword section */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs border border-white/10 hover:text-white/60 hover:border-white/20 transition-colors cursor-default"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Team-specific keyword section for SEO */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id}>
                <h4 className="text-white/40 text-xs font-semibold mb-1.5">
                  {team.name}
                </h4>
                <p className="text-white/25 text-xs leading-relaxed">
                  {team.keywords.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs text-center sm:text-left">
            © {currentYear} Glitter Game Day. All rights reserved. Not affiliated with any
            professional sports team or league.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-xs">Made in Texas ✦</span>
            <a
              href="https://www.etsy.com/shop/GlitterGameDay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              Etsy Shop
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
