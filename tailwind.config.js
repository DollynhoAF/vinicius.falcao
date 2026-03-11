/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        primary: "#050505",
        secondary: "#666666",
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      spacing: {
        'section': '160px',
      },
      borderRadius: {
        'project': '24px',
      },
    },
  },
  plugins: [],
}
