/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          purple: "#7c3aed",
          cyan: "#06b6d4",
          dark: "#080b11",
        },
        obsidian: {
          950: "#06080e",
          900: "#090d16",
          850: "#0e1320",
          800: "#131b2e",
          700: "#1d2740",
          600: "#2d3a5a",
        },
        aurora: {
          violet: "#8b5cf6",
          indigo: "#6366f1",
          emerald: "#10b981",
          mint: "#34d399",
          cyan: "#06b6d4",
          amber: "#f59e0b",
          gold: "#fbbf24",
          rose: "#f43f5e",
        },
      },
      animation: {
        "float": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
