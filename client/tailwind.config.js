import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "sm": "640px",
      "md": "800px"
    },
    extend: {
      spacing: {
        120: "30rem",
        160: "40rem",
      },
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            code: {
              fontWeight: 400,
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
