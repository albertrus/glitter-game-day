"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import type { TeamConfig } from "@/data/teams";
import ProductImage from "./ProductImage";
import { resolveBuy } from "@/lib/commerce";

interface ProductCardProps {
  product: Product;
  team: TeamConfig;
  priority?: boolean;
}

export default function ProductCard({
  product,
  team,
  priority = false,
}: ProductCardProps) {
  const buy = resolveBuy(product);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-colors duration-300"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-white/5 block"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          team={team}
          priority={priority}
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span
          className="inline-block self-start px-2 py-0.5 rounded text-xs font-semibold mb-2"
          style={{
            backgroundColor: `${team.colors.secondary}30`,
            color: team.sparkleColor,
            border: `1px solid ${team.sparkleColor}40`,
          }}
        >
          {team.city} {team.sport}
        </span>

        <h3 className="text-sm font-semibold text-white leading-snug mb-3 line-clamp-2">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span
            className="text-xl font-bold"
            style={{ color: team.sparkleColor }}
          >
            {product.price || "—"}
          </span>

          {buy.kind === "unavailable" ? (
            <span
              className="px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white/40 cursor-not-allowed"
              title="No live listing for this item yet"
            >
              {buy.label}
            </span>
          ) : (
            <a
              href={buy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-xs font-bold text-black transition-transform hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${team.colors.secondary}, ${team.sparkleColor})`,
              }}
              aria-label={`${buy.label}: ${product.name}`}
            >
              {buy.label} &rarr;
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
