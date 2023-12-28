/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      shiro: "#fafaf9", // stone-50
      kuro: "#1c1917", // stone-900
      hai: "#57534e", // stone-600
    }
  },
  plugins: [],
}

