"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { teams } from "@/data/teams";
import { ETSY_SHOP_URL } from "@/lib/site";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation, otherwise it stays open over the
  // new page after a client-side route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Glitter Game Day, home">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Glitter</span>
              <span className="bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                {" "}Game Day
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/shop"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Shop
            </Link>
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/collections/${team.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {team.city}
              </Link>
            ))}
            <Link
              href="/faq"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              FAQ
            </Link>
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Etsy shop
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-white p-2 -mr-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <Link
            href="/shop"
            className="block px-3 py-3 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors mb-2"
          >
            Shop everything
          </Link>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/collections/${team.id}`}
                className="px-3 py-3 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors text-center"
              >
                {team.city} {team.sport}
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            {[
              { href: "/sizing", label: "Sizing" },
              { href: "/care", label: "Care" },
              { href: "/faq", label: "FAQ" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <a
            href={ETSY_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold hover:opacity-90 transition-opacity"
          >
            Etsy shop
          </a>
        </div>
      ) : null}
    </nav>
  );
}
