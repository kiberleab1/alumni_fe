// @ts-nocheck
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/user/events/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // NB: this object used to contain two `extend` keys, so the first one
    // (moveCircle animations) was silently dropped. Merged into one.
    extend: {
      // Institute theme tokens. Values are CSS variables set at runtime by
      // src/lib/theme.jsx from GET /theme (admin: Branding & theme).
      colors: {
        brand: {
          DEFAULT: "rgb(var(--brand-rgb) / <alpha-value>)",
          hover: "var(--brand-hover)",
          ink: "var(--brand-ink)",
          soft: "var(--brand-soft)",
        },
        link: "var(--link)",
        page: "var(--page-bg, #f8fafc)",
        top: { DEFAULT: "var(--top-bg, #fff)", fg: "var(--top-fg, #0f172a)", border: "var(--top-border, #e2e8f0)" },
        pubhead: { DEFAULT: "var(--pub-header-bg, #fff)", fg: "var(--pub-header-fg, #0f172a)", border: "var(--pub-header-border, #e2e8f0)" },
        pubfoot: { DEFAULT: "var(--pub-footer-bg, #0f172a)", fg: "var(--pub-footer-fg, #fff)", muted: "var(--pub-footer-muted, #94a3b8)" },
        accent: "var(--accent)",
        side: {
          DEFAULT: "var(--side-bg)",
          fg: "var(--side-fg)",
          hover: "var(--side-hover)",
          active: "var(--side-active)",
          "active-fg": "var(--side-active-fg)",
        },
      },
      fontFamily: { theme: "var(--font)" },
      borderRadius: { theme: "var(--radius, 16px)", btn: "var(--btn-radius, 10px)" },
      keyframes: {
        moveCircle1: { "0%": { transform: "translate(0, 0)" }, "100%": { transform: "translate(100vw, 100vh)" } },
        moveCircle2: { "0%": { transform: "translate(0, 0)" }, "100%": { transform: "translate(-100vw, 100vh)" } },
        moveCircle3: { "0%": { transform: "translate(0, 0)" }, "100%": { transform: "translate(100vw, -100vh)" } },
        moveCircle4: { "0%": { transform: "translate(0, 0)" }, "100%": { transform: "translate(-100vw, -100vh)" } },
        move: { "0%": { left: "25%" }, "50%": { left: "60%" }, "100%": { left: "25%" } },
      },
      animation: {
        moveCircle1: "moveCircle1 60s linear infinite",
        moveCircle2: "moveCircle2 65s linear infinite",
        moveCircle3: "moveCircle3 50s linear infinite",
        moveCircle4: "moveCircle4 45s linear infinite",
        move: "move 3s ease-in-out infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [
    import("tw-elements-react/dist/plugin.cjs"),
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-webkit-overflow-scrolling": "touch",
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};
