/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2194D2',
      },
      backgroundImage: {
        'home-image': "url('shared/assets/images/main.png')",
      },
    },
  },
  plugins: [],
}
