/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      borderWidth: {
        3: '3px',
      },
      colors: {
        primary: '#2194D2',
        secondary: '#FFAA05',
      },
      backgroundImage: {
        'home-image': "url('./images/main.png')",
        'house-image': "url('./images/test-house.png')",
      },
      fontFamily: {
        inter: 'var(--inter)',
        raleway: 'var(--raleway)',
      },
    },
  },
  plugins: [],
}
