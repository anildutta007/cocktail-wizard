/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cocktail: {
          dark: '#0f0f1f',
          gold: '#d4af37',
          purple: '#6b3fa0',
          light: '#f5f5f5',
          accent: '#ff6b6b',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
