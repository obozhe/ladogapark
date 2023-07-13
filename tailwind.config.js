/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      black: '#221F20',
      white: '#FFF',
    },
    boxShadow: {
      DEFAULT: '1px 1px 30px 0px rgba(0, 0, 0, 0.05)',
    },
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
      gridTemplateRows: {
        'disclosure-0': 'minmax(0, max-content) 0fr',
        'disclosure-2': 'max-content 1fr',
      },
    },
  },
  plugins: [],
};
