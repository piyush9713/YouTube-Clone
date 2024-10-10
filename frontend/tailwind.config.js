/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      screens: {
        sm: "550px", // Overriding the default 'sm' to 500px
      },
    },
  },

  plugins: [],
};
