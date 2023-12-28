/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            code: {
              fontWeight: 400
            }
          }
        }

      }
    },
    colors: {
      shiro: "#fafaf9", // stone-50
      kuro: "#1c1917", // stone-900
      hai: "#57534e", // stone-600
      bg: "#d6d3d1", // stone-300
      bg2: "#f5f5f4", // stone-100
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

