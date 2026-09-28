/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan both the React app and the Django-served static pages so a single
  // design system covers the whole site.
  content: ["./src/**/*.{js,jsx}", "./static/*.html", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#bcd7ff",
          300: "#8ebeff",
          400: "#5999ff",
          500: "#3374fc",
          600: "#1d55f1",
          700: "#1540de",
          800: "#1835b4",
          900: "#1a338e",
          950: "#152156",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -8px rgb(15 23 42 / 0.12)",
      },
    },
  },
  plugins: [],
};
