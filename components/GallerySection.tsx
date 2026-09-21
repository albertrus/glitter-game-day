"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages, driveUrl } from "@/data/gallery";

import { ETSY_SHOP_URL } from "@/lib/site";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
};

export default function GallerySection() {
  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a14] to-black pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-pink-400 mb-3">
            ✦ Every Style, Every Team ✦
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Full Collection{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Everything we have made. Names and numbers can be added to most pieces.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {galleryImages.map((img) => (
            <motion.a
              key={img.id}
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              className="relative aspect-square overflow-hidden rounded-2xl group block ring-1 ring-white/10 hover:ring-pink-400/60 transition-all duration-300"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
            >
              {/* Image */}
              <Image
                src={driveUrl(img.id)}
                alt={`${img.label} — Glitter Game Day`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* CTA chip */}
              <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
                  <span className="text-white text-xs font-semibold truncate mr-2">
                    {img.label}
                  </span>
                  <span className="text-pink-300 text-xs font-bold whitespace-nowrap">
                    Shop →
                  </span>
                </div>
              </div>

              {/* Sparkle on hover */}
              <div className="absolute top-2 right-2 text-yellow-300 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg pointer-events-none">
                ✦
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA below grid */}
        <div className="text-center mt-12">
          <a
            href={ETSY_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-black font-bold text-lg bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 hover:scale-105 hover:opacity-90 transition-all duration-200 shadow-lg shadow-pink-500/30"
          >
            ✦ Shop the Full Collection on Etsy ✦
          </a>
        </div>
      </div>
    </section>
  );
}
