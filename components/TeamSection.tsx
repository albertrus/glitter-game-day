"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProductCard from "./ProductCard";
import SparkleEffect from "./SparkleEffect";
import type { TeamConfig } from "@/data/teams";
import type { Product } from "@/data/products";

interface TeamSectionProps {
  team: TeamConfig;
  products: Product[];
}

export default function TeamSection({ team, products }: TeamSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id={team.id}
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-28 ${team.sectionBg}`}
      aria-labelledby={`${team.id}-heading`}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${team.sparkleColor}12 0%, transparent 60%)`,
        }}
      />

      {/* Subtle sparkle layer when in view */}
      {isInView && (
        <SparkleEffect
          color={team.sparkleColor}
          particleCount={25}
          continuous={true}
          className="opacity-40"
        />
      )}

      {/* Texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, currentColor, currentColor 1px, transparent 1px, transparent 8px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 sm:mb-16"
        >
          {/* League / sport badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                backgroundColor: `${team.sparkleColor}20`,
                color: team.sparkleColor,
                border: `1px solid ${team.sparkleColor}40`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: team.sparkleColor }}
              />
              {team.league} · {team.sport} · {team.city}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            id={`${team.id}-heading`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3"
          >
            {team.headline}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl font-semibold mb-4"
            style={{ color: team.sparkleColor }}
          >
            {team.subheadline}
          </motion.p>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/65 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            {team.copy}
          </motion.p>

          {/* Keywords (hidden visually, shown to SEO) */}
          <div className="sr-only">
            {team.keywords.map((kw) => (
              <span key={kw}>{kw} </span>
            ))}
          </div>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px mb-12 origin-left"
          style={{
            background: `linear-gradient(to right, ${team.sparkleColor}80, transparent)`,
          }}
        />

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 + i * 0.1 }}
            >
              <ProductCard product={product} team={team} />
            </motion.div>
          ))}
        </div>

        {/* Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <a
            href="https://www.etsy.com/shop/GlitterGameDay"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${team.colors.secondary}, ${team.sparkleColor})`,
              color: team.id === "cowboys" || team.id === "spurs" ? "#000" : "#fff",
            }}
          >
            Shop {team.name.split(" ").slice(-1)[0]} Jerseys on Etsy
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <span className="text-xs text-white/40">
            Free shipping on orders over $50 · Ships from Texas
          </span>
        </motion.div>
      </div>
    </section>
  );
}
