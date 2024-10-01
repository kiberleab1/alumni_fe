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
    extend: {
      keyframes: {
        moveCircle1: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(100vw, 100vh)" },
        },
        moveCircle2: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-100vw, 100vh)" },
        },
        moveCircle3: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(100vw, -100vh)" },
        },
        moveCircle4: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-100vw, -100vh)" },
        },
      },
      animation: {
        moveCircle1: "moveCircle1 60s linear infinite",
        moveCircle2: "moveCircle2 65s linear infinite",
        moveCircle3: "moveCircle3 50s linear infinite",
        moveCircle4: "moveCircle4 45s linear infinite",
      },
    },
    extend: {
      keyframes: {
        move: {
          "0%": { left: "25%" },
          "50%": { left: "60%" },
          "100%": { left: "25%" },
        },
      },
      animation: {
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
