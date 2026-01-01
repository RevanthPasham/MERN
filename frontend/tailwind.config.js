/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideFromRight: {
          from: { transform: "translateX(200px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        slideFromRight: "slideFromRight 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
