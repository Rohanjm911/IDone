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
        apple: {
          bg: "#F5F5F7",
          darkBg: "#000000",
          card: "#FFFFFF",
          cardDark: "#161618",
          cardElevatedDark: "#1C1C1E",
          cardSubtleDark: "#2C2C2E",
          blue: "#0071E3",
          blueDark: "#0A84FF",
          green: "#34C759",
          greenDark: "#30D158",
          orange: "#FF9500",
          orangeDark: "#FF9F0A",
          red: "#FF3B30",
          redDark: "#FF453A",
          purple: "#AF52DE",
          purpleDark: "#BF5AF2",
          grayText: "#86868B",
          grayDarkText: "#A1A1A6",
          subtleBorder: "rgba(0, 0, 0, 0.08)",
          subtleBorderDark: "rgba(255, 255, 255, 0.09)",
        },
        navy: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        offwhite: {
          50: "#F5F5F7",
          100: "#EAEAEF",
          200: "#DCDCE2",
        },
        trust: {
          600: "#0071E3",
          700: "#0058B0",
          50: "#F0F6FF",
          100: "#E0EEFF",
        },
        success: {
          600: "#34C759",
          700: "#28A745",
          50: "#F0FDF4",
          100: "#DCFCE7",
        },
        alert: {
          600: "#FF3B30",
          700: "#D70015",
          50: "#FFF2F2",
          100: "#FFE5E5",
        },
        amber: {
          600: "#FF9500",
          700: "#C97600",
          50: "#FFF9F0",
          100: "#FFEDD5",
        },
        slate: {
          500: "#86868B",
          600: "#6E6E73",
          400: "#A1A1A6",
          300: "#D2D2D7",
        },
        dark: {
          bg: "#000000",
          card: "#161618",
          elevated: "#1C1C1E",
          subtle: "#2C2C2E",
          border: "rgba(255, 255, 255, 0.1)",
          borderSubtle: "rgba(255, 255, 255, 0.06)",
          hover: "#222224",
          muted: "#A1A1A6",
          subtext: "#86868B",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        mono: ["SF Mono", "JetBrains Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "22px",
        "4xl": "28px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        card: "0 2px 12px -2px rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        "card-hover": "0 12px 28px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
        modal: "0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 12px 24px -8px rgba(0, 0, 0, 0.12)",
        "apple-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "apple-glow": "0 0 24px -4px rgba(0, 113, 227, 0.35)",
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
