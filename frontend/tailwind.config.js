/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // you can add custom colours later (e.g. space‑green, nebula‑purple)
      colors: {
        "space-green": "#0f9d58",
        "nebula-purple": "#6e44ff",
      },
    },
  },
  plugins: [],
};
