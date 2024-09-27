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
          'gray-1': '#F8F8F8',
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
          'gray-1': '#070707',
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
      // fontSize: {
      //   'H1-18': ['18px', '23px'],
      //   'H2-16': ['16px', '20px'],
      //   'H3-14': ['14px', '18px'],
      //   'Subtitle1-10': ['10px', '13px'],
      //   'Subtitle2-12': ['12px', '15px'],
      // },
      // fontFamily: {
      //   gerbera: ['Gerbera'],
      //   gerberaLight: ['GerberaLight'],
      //   gerberaMedium: ['GerberaMedium'],
      // },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.font-gerbera-h1': {
          fontFamily: 'Gerbera',
          fontSize: '18px',
          lineHeight: '23px',
        },

        '.font-gerbera-h2': {
          fontFamily: 'Gerbera',
          fontSize: '16px',
          lineHeight: '20px',
        },

        '.font-gerbera-h3': {
          fontFamily: 'Gerbera',
          fontSize: '14px',
          lineHeight: '18px',
        },

        '.font-gerbera-sub1': {
          fontFamily: 'GerberaLight',
          fontSize: '10px',
          lineHeight: '13px',
        },

        '.font-gerbera-sub2': {
          fontFamily: 'Gerbera',
          fontSize: '12px',
          lineHeight: '15px',
        },

        '.font-gerbera-sub3': {
          fontFamily: 'GerberaLight',
          fontSize: '12px',
          lineHeight: '15px',
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
