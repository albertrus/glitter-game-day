"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/products";
import type { TeamConfig } from "@/data/teams";

interface ProductCardProps {
  product: Product;
  team: TeamConfig;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.floor(rating)
              ? "text-yellow-400"
              : star - 0.5 <= rating
              ? "text-yellow-300"
              : "text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, team }: ProductCardProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [sparkleId, setSparkleId] = useState(0);

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparkles = Array.from({ length: 5 }, (_, i) => ({
      id: sparkleId + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setSparkleId((prev) => prev + 5);
    setSparkles((prev) => [...prev.slice(-10), ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.find((n) => n.id === s.id)));
    }, 700);
  };

  // JSON-LD structured data for this product
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.name} — available on Etsy from Glitter Game Day`,
    image: `https://glittergameday.com${product.image}`,
    offers: {
      "@type": "Offer",
      price: product.price.replace("$", ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: product.etsyUrl,
      seller: {
        "@type": "Organization",
        name: "Glitter Game Day",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseMove={handleHover}
        className="relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
        style={{
          boxShadow: `0 0 0 0 ${team.colors.secondary}00`,
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            boxShadow: `inset 0 0 30px ${team.sparkleColor}20`,
          }}
        />

        {/* Micro sparkles on hover */}
        <AnimatePresence>
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute w-2 h-2 pointer-events-none z-20"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                color: team.sparkleColor,
              }}
            >
              ✦
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-white/5">
          <Image
            src={product.image}
            alt={`${product.name} — Glitter Game Day sequin jersey for ${team.name} fans`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          {/* Placeholder gradient when no image */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary}40)`,
            }}
          >
            <span className="text-5xl opacity-50">✦</span>
          </div>

          {/* Badge */}
          {product.badge && (
            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold z-10"
              style={{
                backgroundColor: team.colors.secondary,
                color:
                  team.id === "cowboys" || team.id === "spurs"
                    ? team.colors.primary
                    : "#FFFFFF",
              }}
            >
              {product.badge}
            </div>
          )}

          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Card body */}
        <div className="p-4">
          {/* Team badge */}
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2"
            style={{
              backgroundColor: `${team.colors.secondary}30`,
              color: team.sparkleColor,
              border: `1px solid ${team.sparkleColor}40`,
            }}
          >
            {team.name} · {team.league}
          </span>

          {/* Product name */}
          <h3 className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-white/50">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <span
              className="text-xl font-bold"
              style={{ color: team.sparkleColor }}
            >
              {product.price}
            </span>
            <a
              href={product.etsyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 rounded-full text-xs font-bold text-black transition-all hover:scale-105 hover:opacity-90 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${team.colors.secondary}, ${team.sparkleColor})`,
              }}
              aria-label={`Shop ${product.name} on Etsy`}
            >
              Shop on Etsy →
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}
