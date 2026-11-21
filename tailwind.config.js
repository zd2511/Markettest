/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { rocket: { orange: '#ff6a2b', ember: '#ff9a54', black: '#030303' } },
      fontFamily: { display: ['Orbitron', 'sans-serif'], body: ['Manrope', 'sans-serif'] }
    }
  },
  plugins: []
}