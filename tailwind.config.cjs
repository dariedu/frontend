/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
     colors: {
        'Gray/White': '#FFFFFF',
        'Gray/2': '#F8F8F8',
        'Gray/3': '#BFBFBF',
        'Gray/4': '#888888',
        'Gray/5': '#575757',
        'Gray/6 Logo': '#1A1A1A',
        'Gray/7 Text': '#070707',
        'Gray/Black': '#000000',
        'Brand/Green': '#38AB78'
    },
      fontSize: {
        'H1': ['18px', '23px'],
        'H2': ['14px', '18px'],
        'Subtitle1': ['10px', '13px'],
        'Subtitle2': ['12px', '17px']
      },
      fontFamily: {
        'gerbera': ['Gerbera'],
        'gerberaLight': ['GerberaLight'],
        'gerberaMedium': ['GerberaMedium'],
      },
    extend: {},
  },
  plugins: [],
};
