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
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 84% 4.9%))",
        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%))",
          foreground: "hsl(var(--card-foreground, 222.2 84% 4.9%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 40% 96.1%))",
          foreground: "hsl(var(--muted-foreground, 215.4 16.3% 46.9%))",
        },
        border: "hsl(var(--border, 214.3 31.8% 91.4%))",
        input: "hsl(var(--input, 214.3 31.8% 91.4%))",
        ring: "hsl(var(--ring, 222.2 84% 4.9%))",
        nyaya: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          slate: "#F1F5F9",
          navy: "#0F172A",
          gold: "#D97706",
          goldLight: "#FEF3C7",
          blue: "#2563EB",
          blueLight: "#EFF6FF",
          indigo: "#4F46E5",
          cyan: "#06B6D4",
          cyanLight: "#F0F9FF",
          pass: "#10B981",
          passLight: "#ECFDF5",
          fail: "#E11D48",
          failLight: "#FFF1F2",
          review: "#D97706",
          reviewLight: "#FEF3C7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        indic: ["var(--font-indic)", "Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
