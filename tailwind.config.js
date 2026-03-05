/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#1A1A2E',
        'surface-2': '#252540',
        primary: '#7C3AED',
        'primary-light': '#9D5BF0',
        accent: '#F59E0B',
        'accent-light': '#FCD34D',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        'text-muted': '#475569',
        success: '#10B981',
        danger: '#EF4444',
        border: '#2D2D4E',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
