"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { teams } from "@/data/teams";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Glitter Game Day Home"
          >
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Glitter</span>
              <span className="bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                {" "}Game Day
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {teams.map((team) => (
              <a
                key={team.id}
                href={`#${team.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white transition-colors hover:bg-white/10"
              >
                {team.name.split(" ").slice(-1)[0]}
              </a>
            ))}
            <a
              href="https://www.etsy.com/shop/GlitterGameDay"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Shop Etsy ✦
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {teams.map((team) => (
              <a
                key={team.id}
                href={`#${team.id}`}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors text-center"
              >
                {team.name}
              </a>
            ))}
          </div>
          <a
            href="https://www.etsy.com/shop/GlitterGameDay"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold hover:opacity-90 transition-opacity"
          >
            Shop All on Etsy ✦
          </a>
        </div>
      )}
    </nav>
  );
}
