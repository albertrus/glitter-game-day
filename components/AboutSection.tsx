"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ETSY_SHOP_URL } from "@/lib/site";

/**
 * This section previously carried three invented statistics ("500+ Happy
 * Fans", "5-star Avg. Rating", "thousands of Texas fans"). None of them came
 * from anywhere. Unverifiable volume and rating claims on a storefront are
 * exactly what the FTC's rule on fake reviews and testimonials covers, and
 * they are also the fastest way to lose a customer who checks Etsy and finds
 * a different number. They are replaced below with facts about the product,
 * which are true and are also what an actual buyer wants to know.
 */
export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const facts = [
    { value: "Hand-finished", label: "Every piece" },
    { value: "Made to order", label: "No dead stock" },
    { value: "Relaxed cut", label: "Sizes S to 2XL" },
  ];

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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-pink-400/40 bg-pink-500/10 text-pink-300 text-xs font-semibold tracking-widest uppercase mb-6">
            Our story
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Where fandom meets{" "}
            <span className="bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent">
              fashion
            </span>
          </h2>

          <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Game day clothes for women usually come in two flavors. A men&apos;s
            tee cut for a body that is not yours, or something pink and tiny
            that nobody actually wants to wear to a stadium in October. We make
            the third option.
          </p>

          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
            Every piece is a full sequin build, cut relaxed so it moves, and
            finished by hand one at a time. Nothing is mass printed and nothing
            sits in a warehouse. You order it, we make it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="text-xl sm:text-2xl font-extrabold text-white mb-1">
                  {fact.value}
                </div>
                <div className="text-white/50 text-xs uppercase tracking-widest">
                  {fact.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/shop"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold text-lg hover:opacity-90 transition-all hover:scale-105"
            >
              Shop everything
            </Link>
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Find us on Etsy
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
