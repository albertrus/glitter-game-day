"use client";

import { motion } from "framer-motion";
import SparkleEffect from "./SparkleEffect";
import { teams } from "@/data/teams";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #3d0030 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, #001a4d 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, #1a0020 0%, transparent 60%), #000000",
        }}
      />

      {/* Sparkle canvas — full burst on load */}
      <SparkleEffect
        color="#FFD700"
        particleCount={80}
        continuous={true}
        className="z-10"
      />

      {/* Glitter overlay shimmer */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-pink-400/40 bg-pink-500/10 text-pink-300 text-xs font-semibold tracking-widest uppercase">
            ✦ Texas Sports Fashion ✦
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-4"
        >
          Game Day Never
          <br />
          <span
            className="bg-gradient-to-r from-pink-400 via-yellow-300 via-pink-300 to-yellow-400 bg-clip-text text-transparent"
            style={{ backgroundSize: "200% auto" }}
          >
            Looked So Good.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Sequin jerseys for every Texas team.{" "}
          <span className="text-white/90">
            Built for the stands. Made to sparkle.
          </span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#astros"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-pink-500/25"
          >
            Shop All Teams{" "}
            <span className="group-hover:translate-x-1 inline-block transition-transform">
              →
            </span>
          </a>
          <a
            href="https://www.etsy.com/shop/GlitterGameDay"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all hover:scale-105 hover:border-white/60"
          >
            View All on Etsy ✦
          </a>
        </motion.div>

        {/* Team quick-nav pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {teams.map((team, i) => (
            <motion.a
              key={team.id}
              href={`#${team.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all"
            >
              {team.name}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
