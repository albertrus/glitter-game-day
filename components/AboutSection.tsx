"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d0020 0%, #000815 50%, #1a000d 100%)",
      }}
    >
      {/* Decorative glitter dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor:
                i % 3 === 0
                  ? "#FFD700"
                  : i % 3 === 1
                  ? "#FF69B4"
                  : "#C4CED4",
              opacity: Math.random() * 0.4 + 0.1,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Label */}
          <span className="inline-block px-4 py-1.5 rounded-full border border-pink-400/40 bg-pink-500/10 text-pink-300 text-xs font-semibold tracking-widest uppercase mb-6">
            ✦ Our Story
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Glitter Game Day —{" "}
            <span className="bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent">
              Where Fandom Meets Fashion
            </span>
          </h2>

          <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            We started Glitter Game Day because we were tired of choosing between
            looking cute and repping our teams. Every Texas woman deserves a game
            day jersey that turns heads in the stands <em>and</em> on Instagram.
          </p>

          <p className="text-white/60 text-base leading-relaxed mb-6 max-w-2xl mx-auto">
            Our hand-crafted sequin jerseys are made for real fans — the ones who
            know every player&apos;s stats but also know how to put together a look.
            Houston, Dallas, San Antonio: we&apos;ve got your team, and we&apos;ve got your
            style.
          </p>

          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Every jersey is made to order with love and a lot of glitter. Find us on
            Etsy and join thousands of Texas fans who&apos;ve discovered that game day
            fashion doesn&apos;t have to be boring.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { value: "6", label: "Texas Teams" },
              { value: "500+", label: "Happy Fans" },
              { value: "5★", label: "Avg. Rating" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/50 text-xs uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <a
            href="https://www.etsy.com/shop/GlitterGameDay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-pink-500/20"
          >
            Meet Us on Etsy ✦
          </a>
        </motion.div>
      </div>
    </section>
  );
}
