/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF3E4",
        ink: "#1A1614",
        grass: "#1E824C",
        "grass-dark": "#155d38",
        coral: "#FF5A3C",
        gold: "#F4B740",
      },
      fontFamily: {
        display: ['"Anton"', "system-ui", "sans-serif"],
        body: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "6px 6px 0 0 #1A1614",
        "card-sm": "3px 3px 0 0 #1A1614",
        "card-lg": "10px 10px 0 0 #1A1614",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
    },
  },
  plugins: [],
};
