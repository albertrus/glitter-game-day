"use client";

import { useState } from "react";
import Image from "next/image";
import type { TeamConfig } from "@/data/teams";

interface ProductImageProps {
  src: string | null;
  alt: string;
  team: TeamConfig;
  priority?: boolean;
  sizes?: string;
}

/**
 * Renders a product photo with a real fallback.
 *
 * The previous implementation stacked an always-visible gradient <div> on top
 * of the <Image>, so the placeholder covered every photo and no product image
 * was ever visible. Here the placeholder only renders when there is no src or
 * the image actually fails to load.
 */
export default function ProductImage({
  src,
  alt,
  team,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div
        role="img"
        aria-label={`${alt} (photo coming soon)`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{
          background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary}40)`,
        }}
      >
        <span className="text-5xl opacity-50" aria-hidden="true">
          &#10022;
        </span>
        <span className="text-[10px] uppercase tracking-widest text-white/50">
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
