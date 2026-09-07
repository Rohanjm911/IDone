/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        offwhite: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
        },
        trust: {
          600: "#2563EB",
          700: "#1D4ED8",
          50: "#EFF6FF",
          100: "#DBEAFE",
        },
        success: {
          600: "#16A34A",
          700: "#15803D",
          50: "#F0FDF4",
          100: "#DCFCE7",
        },
        alert: {
          600: "#DC2626",
          700: "#B91C1C",
          50: "#FEF2F2",
          100: "#FEE2E2",
        },
        amber: {
          600: "#D97706",
          700: "#B45309",
          50: "#FFFBEB",
          100: "#FEF3C7",
        },
        slate: {
          500: "#64748B",
          600: "#475569",
          400: "#94A3B8",
          300: "#CBD5E1",
        },
        dark: {
          bg: "#0A0A0A",
          card: "#121212",
          elevated: "#181818",
          subtle: "#1F1F1F",
          border: "#262626",
          borderSubtle: "#1C1C1C",
          hover: "#242424",
          muted: "#9E9E9E",
          subtext: "#6E6E6E",
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 6px 16px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)",
      },
      keyframes: {
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeSlideDown: {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        calmPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.95)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)" },
          "50%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-slide-up": "fadeSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-slide-down": "fadeSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "calm-pulse": "calmPulse 2.4s ease-in-out infinite",
        pop: "pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
