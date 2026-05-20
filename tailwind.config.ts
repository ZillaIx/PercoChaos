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
        slate: {
          950: "#020617",
        },
        solana: {
          green: "#14F195",
          purple: "#9945FF",
        },
        deficit: {
          red: "#EF4444",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        glitch: "glitch 0.15s steps(2) infinite",
        "neon-pulse": "neon-pulse 2.5s ease-in-out infinite",
        "chart-flash": "chart-flash 0.8s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-3px, 1px)" },
          "40%": { transform: "translate(3px, -1px)" },
          "60%": { transform: "translate(-2px, -1px)" },
          "80%": { transform: "translate(2px, 1px)" },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.85", filter: "brightness(1.15)" },
        },
        "chart-flash": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      boxShadow: {
        "neon-green": "0 0 12px rgba(20, 241, 149, 0.45), 0 0 32px rgba(20, 241, 149, 0.15)",
        "neon-purple": "0 0 12px rgba(153, 69, 255, 0.45), 0 0 32px rgba(153, 69, 255, 0.15)",
        "neon-red": "0 0 12px rgba(239, 68, 68, 0.55), 0 0 32px rgba(239, 68, 68, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
