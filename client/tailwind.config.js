// tailwind.config.js
import animate from "tailwindcss-animate";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@shadcn/ui/dist/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#3E9E3B", light: "#53B750", dark: "#2E7A2C" },
        secondary: { DEFAULT: "#2260A6", light: "#3A7AC2", dark: "#1A4C82" },
        accent: { orange: "#E86C1A" },
        // Optional: tiny golden sparkle (used only once)
        gold: "#FFD700",
      },
    },
  },
  plugins: [animate],
};