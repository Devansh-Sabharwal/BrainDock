/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-1000': '#26262a',
        'gray-950':  '#151718'
      },
      backgroundImage:{
        'landing-bg':"url('./assets/bg.png')",
        'text-gradient': 'linear-gradient(to right, #fc72ff, #8f68ff, #487bff, #8f68ff, #fc72ff)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as the default sans-serif font
      },
      // fontSize:{
      //   '7xl':'6rem'
      // }
    },
  },
  plugins: [],
}
