import Link from "next/link";
import { teams } from "@/data/teams";
import { ETSY_SHOP_URL } from "@/lib/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-white/10">
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
          Where fandom meets fashion.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold hover:opacity-90 transition-opacity"
          >
            Shop everything
          </Link>
          <a
            href={ETSY_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-colors"
          >
            Visit the Etsy shop
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Collections
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/collections/${team.id}`}
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: team.sparkleColor }}
                  />
                  {team.city} {team.sport}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Help
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/sizing", label: "Sizing guide" },
                { href: "/care", label: "Care instructions" },
                { href: "/faq", label: "FAQ" },
                { href: "/policies/shipping-returns", label: "Shipping and returns" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-white/60 hover:text-white text-sm transition-colors">
                  Our story
                </Link>
              </li>
              <li>
                <a
                  href={ETSY_SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Etsy shop
                </a>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs text-center sm:text-left max-w-2xl">
            &copy; {currentYear} Glitter Game Day. Independent seller. Not
            affiliated with, endorsed by, or licensed by any professional or
            collegiate sports team, league, or licensing body.
          </p>
          <span className="text-white/20 text-xs whitespace-nowrap">
            Hand-finished &#10022;
          </span>
        </div>
      </div>
    </footer>
  );
}
