/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#34C759',
          dark: '#30D158',
          light: 'rgba(52, 199, 89, 0.12)',
          lightDark: 'rgba(48, 209, 88, 0.18)',
        },
        surface: {
          DEFAULT: '#F2F2F7',
          dark: '#1C1C1E',
        },
        elevated: {
          DEFAULT: '#F2F2F7',
          dark: '#2C2C2E',
        },
        border: {
          DEFAULT: '#E5E5EA',
          dark: '#38383A',
        },
        textSecondary: {
          DEFAULT: '#8E8E93',
          dark: '#98989D',
        },
      },
    },
  },
  plugins: [],
};