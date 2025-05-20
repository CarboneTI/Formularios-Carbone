/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF9E6',
          100: '#FFF2CC',
          200: '#FFE699',
          300: '#FFD966',
          400: '#FFCD33',
          500: '#FFC600',
          600: '#CC9E00',
          700: '#997700',
          800: '#664F00',
          900: '#332800',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'inner-gold': 'inset 0 2px 4px 0 rgba(255, 198, 0, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 