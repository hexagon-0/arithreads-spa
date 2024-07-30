/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        highlight: 'inset 1px 1px 0 0 #ffffff0d',
      }
    },
  },
  plugins: [],
}

