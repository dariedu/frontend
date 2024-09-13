/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          'gray-white': '#FFFFFF',
          'gray-1': '#F8F8F8',
          'gray-2': '#DFDFDF',
          'gray-3': '#BFBFBF',
          'gray-4': '#888888',
          'gray-5': '#575757',
          'gray-6': '#323232',
          'gray-7-logo': '#1F1F1F',
          'gray-8-text': '#0A0A0A',
          'gray-black': '#000000',
          'brand-green': '#38AB78',
        },
        dark: {
          'gray-white': '#000000',
          'gray-1': '#070707',
          'gray-2': '#DFDFDF',
          'gray-3': '#575757',
          'gray-4': '#888888',
          'gray-5': 'white',
          'gray-6': '#323232',
          'gray-7-logo': '#F8F8F8',
          'gray-8-text': '#FFFFFF',
          'gray-black': '#FFFFFF',
          'brand-green': '#38AB78',
        },
      },
      fontSize: {
        H1: ['18px', '23px'],
        H2: ['14px', '18px'],
        Subtitle1: ['10px', '13px'],
        Subtitle2: ['12px', '17px'],
      },
      fontFamily: {
        gerbera: ['Gerbera'],
        gerberaLight: ['GerberaLight'],
        gerberaMedium: ['GerberaMedium'],
      },
    },
  },
  plugins: [],
};

{
  /* <div class="bg-light-gray-white text-light-gray-7-text dark:bg-dark-gray-white dark:text-dark-gray-7-text">
  <!-- Ваш контент -->
</div> */
}
