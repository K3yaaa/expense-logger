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
        night: {
          black: '#0a0a0a',
          indigo: '#1a1a3e',
          deep: '#0d0d2b',
        },
        indigo: {
          950: '#0d0d2b',
          900: '#1a1a3e',
          800: '#2d4a8c',
          700: '#3d5a9c',
          600: '#4d6aac',
        },
        gold: {
          DEFAULT: '#ffd700',
          warm: '#f0c040',
          light: '#ffec80',
          dark: '#b8860b',
        },
        cream: {
          white: '#f5f0e0',
          light: '#faf5e8',
        },
        lavender: {
          soft: '#c4a7e7',
          dark: '#9b7ec7',
        },
        cyan: {
          glow: '#00d4ff',
          dark: '#00a8cc',
        },
        rose: {
          glow: '#ff9ecd',
        },
        dark: {
          900: '#0a0a0a',
          800: '#0d0d2b',
          700: '#1a1a3e',
          600: '#2d4a8c',
          500: '#3d5a9c',
        },
        accent: {
          DEFAULT: '#ffd700',
          light: '#f0c040',
          dark: '#b8860b',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 20s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}
