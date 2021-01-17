const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'media',
  purge: [],
  theme: {
    extend: {
      zIndex: {
        '-10': '-10',
      },
      height: {
        'golden-upper': '61.8vh',
        'golden-lower': '38.2vh',
        'golden-upper-sq': '88.6vh'
      },
      gridTemplateColumns: {
         'index':'repeat(auto-fill, minmax(300px, 1fr))'
      },
      colors: {
        'gradient1': '#ff7c6e',
        'gradient2': '#f5317f',
        'gradient3': '#dc006b',
        'black-900': '#111',
        rose: colors.rose
      },
    },
    boxShadow:{
      'dark-md': '0 4px 6px -1px rgba(255,255,255, 0.1), 0 2px 4px -1px rgba(255,255,255, 0.06)'
    }
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
    }
  },
};
