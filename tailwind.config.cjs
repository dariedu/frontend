/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      opacity: {
        47: '0.47',
      },
      colors: {
        light: {
          'gray-white': '#FFFFFF',
          'gray-1': '#F2F2F2', //// новый цвет от 28.02.2025, предыдущий цвет #F6F6F6
          'gray-2': '#D7D7D7',
          'gray-3': '#BFBFBF',
          'gray-4': '#888888',
          'gray-5': '#575757',
          'gray-6': '#323232',
          'gray-7-logo': '#1F1F1F',
          'gray-8-text': '#0A0A0A',
          'gray-black': '#000000',
          'brand-green': '#38AB78',
          'gray-blyer': '#929292',
          'gray-blyer-dark': '#767676',
          'error-red': '#F93C3C',
          'error-back': '#FFECEC',
        },
        dark: {
          // 'gray-white': '#000000',
         // 'gray-1': '#070707',
          // 'gray-2': '#DFDFDF',
          // 'gray-3': '#575757',
          // 'gray-4': '#888888',
          // 'gray-5': 'white',
          // 'gray-6': '#323232',
          // 'gray-7-logo': '#F8F8F8',
          // 'gray-8-text': '#FFFFFF',
          // 'gray-black': '#FFFFFF',
          // 'brand-green': '#38AB78',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.font-gerbera-st': {
          fontFamily: 'Gerbera',
          fontSize: '26px',
          lineHeight: '130%',
        },
        '.font-gerbera-h1': {
          fontFamily: 'Gerbera',
          fontSize: '20px',
          lineHeight: '130%',
        },

        '.font-gerbera-h2': {
          fontFamily: 'Gerbera',
          fontSize: '18px',
          lineHeight: '130%',
        },

        '.font-gerbera-h3': {
          fontFamily: 'Gerbera',
          fontSize: '16px',
          lineHeight: '130%',
        },

        '.font-gerbera-sub1': {
          fontFamily: 'GerberaLight',
          fontSize: '12px',
          lineHeight: '130%',
        },

        '.font-gerbera-sub2': {
          fontFamily: 'Gerbera',
          fontSize: '14px',
          lineHeight: '130%',
        },

        '.font-gerbera-sub3': {
          fontFamily: 'GerberaLight',
          fontSize: '14px',
          lineHeight: '130%',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

{
  /* <div class="bg-light-gray-white text-light-gray-7-text dark:bg-dark-gray-white dark:text-dark-gray-7-text">
  <!-- Ваш контент -->
</div> */
}
