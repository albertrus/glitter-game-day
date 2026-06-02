import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        astros: {
          navy: "#002D62",
          orange: "#EB6E1F",
        },
        rangers: {
          blue: "#003278",
          red: "#C0111F",
        },
        texans: {
          navy: "#03202F",
          red: "#C41230",
        },
        cowboys: {
          navy: "#003594",
          silver: "#869397",
          dark: "#041E42",
        },
        rockets: {
          red: "#CE1141",
          silver: "#C4CED4",
        },
        spurs: {
          black: "#000000",
          silver: "#C4CED4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "sparkle-burst": "sparkle-burst 0.8s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "glitter-fall": "glitter-fall 3s ease-in infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "sparkle-burst": {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1.5) rotate(180deg)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glitter-fall": {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(100vh) rotate(720deg)",
            opacity: "0",
          },
        },
      },
      backgroundImage: {
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
