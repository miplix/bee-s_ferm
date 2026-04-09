/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: { 100: "#EAD4AA", 200: "#E7C896", 300: "#C8A36E", 400: "#A87B4F", 500: "#7C4A1E", 600: "#5C3210", 700: "#3E2210" },
      },
      fontFamily: { game: ['"Press Start 2P"', "monospace"] },
    },
  },
  plugins: [],
};
