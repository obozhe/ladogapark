/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        black: 'rgb(var(--color-primary) / <alpha-value>)',
        primary: '#2194D2',
        secondary: '#FFAA05',
        tertiary: '#898989',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      boxShadow: {
        DEFAULT: '1px 1px 30px 0px rgba(0, 0, 0, 0.05)',
      },
      borderWidth: {
        3: '3px',
      },
      backgroundImage: {
        'home-image': "url('./images/main.avif')",
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
