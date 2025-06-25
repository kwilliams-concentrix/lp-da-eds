const { spacing } = require('tailwindcss/defaultTheme');

const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '414px',
        // => @media (min-width: 414px) { ... }
        'sm': '601px',
        // => @media (min-width: 601px) { ... }
        'md': '901px',
        // => @media (min-width: 901px) { ... }
        'lg': '1280px',
        // => @media (min-width: 1280px) { ... }
        'xl': '1440px',
        // => @media (min-width: 1440px) { ... }
        '2xl': '1536px' // => @media (min-width: 1536px) { ... }
      },
      fontFamily: {
        sans: ["Gotham", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Chronicle Deck", "Georgia", "Times", "serif"],
        inter: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
        arial: ["Arial", "Gotham", "Helvetica Neue", "sans-serif"],
        roboto: ["Roboto", "Helvetica Neue", "sans-serif"],
        serifsemibold: ["Chronicle Deck Semibold", "Georgia", "Times", "serif"]
      },
      fontSize: {
        sm: '1.2rem',
        base: '1.4rem',
        lg: '1.6rem',
        xl: '1.8rem',
        '2xl': '2rem',
        '3xl': '2.4rem',
        '4xl': '3rem',
        '5xl': '3.2rem',
      },
      colors: {
        primary: {
          lighter: '#ee0000',
          "DEFAULT": '#cc0000',
          darker: '#990000'
        },
        secondary: {
          lighter: '#cce3f1',
          "DEFAULT": '#0077bb',
          darker: '#004770'
        },
        background: {
          lighter: colors.blue['100'],
          "DEFAULT": colors.blue['300'],
          darker: colors.blue['300']
        },
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        'redlamps1':      '#cc0000',
        'redlamps2':      '#ee0000',
        'redlamps3':      '#990000',
        'redlamps4':      '#ffebeb',
        'bluepros':       '#0077bb',
        'blueprossoft':   '#edf5fd',
        'blueprosdark':   '#0e6394',
        'neutral050':     '#f8f8f8',
        'neutral100':     '#f0f0f0',
        'neutral200':     '#e6e6e6',
        'neutral300':     '#d5d5d5',
        'neutral400':     '#b0b0b0',
        'neutral500':     '#909090',
        'neutral600':     '#686868',
        'neutral700':     '#555555',
        'neutral800':     '#373737',
        'neutral900':     '#171717',
        'neutralborder':  '#bbbbbb',
        'neutralsolid':   '#686868',
        'neutralhover':   '#f0f0f0',
        'txticon':        '#000000',
        'txtprimary':     '#333333',
        'txtsecondary':   '#595959',
        'txtheadings':    '#333333',
        'msgsuccesssoft': '#e3fbe3',
        'msgsuccesstxt':  '#0a470a',
        'msgwarningsoft': '#fdf0e1',
        'msgwarningtxt':  '#492b08',
        'msgerrorsoft':   '#fef6f6',
        'msgerrortxt':    '#7d1212',
        'msgneutralsoft': '#f0f0f0',
        'msgneutraltxt':  '#555555',
        'inputbg':        '#171717',
        'menuborder':     '#CBCBCB',
        'commonblack':    '#000000',
        'commonwhite':    '#ffffff'
      },
      textColor: {
        orange: colors.orange,
        red: { ...colors.red,
          "DEFAULT": colors.red['500']
        },
        primary: {
          lighter: '#32383e',
          "DEFAULT": '#171a1c',
          darker: '#636b74'
        },
        secondary: {
          lighter: '#555e68',
          "DEFAULT": '#32383e',
          darker: '#171a1c'
        }
      },
      backgroundColor: {
        primary: {
          lighter: '#ee0000',
          "DEFAULT": '#cc0000',
          darker: '#990000'
        },
        secondary: {
          lighter: '#edf5fd',
          "DEFAULT": '#0077bb',
          darker: '#0e6394'
        },
        container: {
          lighter: '#ffffff',
          "DEFAULT": '#fafafa',
          darker: '#f5f5f5'
        }
      },
      borderColor: {
        primary: {
          lighter: '#ee0000',
          "DEFAULT": '#cc0000',
          darker: '#990000'
        },
        secondary: {
          lighter: '#cce3f1',
          "DEFAULT": '#0077bb',
          darker: '#004770'
        },
        container: {
          lighter: '#f5f5f5',
          "DEFAULT": '#e7e7e7',
          darker: '#b6b6b6'
        }
      },
      minWidth: {
        8: spacing['8'],
        20: spacing['20'],
        40: spacing['40'],
        48: spacing['48'],
      },
      minHeight: {
        14: spacing['14'],
        a11y: '44px',
        'screen-25': '25vh',
        'screen-50': '50vh',
        'screen-75': '75vh',
      },
      maxHeight: {
        0: '0',
        'screen-25': '25vh',
        'screen-50': '50vh',
        'screen-75': '75vh',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          xs: '1rem',
          sm: '1rem',
          md: '1.5rem'
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  content: ['../*.html', '../scripts/scripts.js', '../blocks/**/*.js'],
};
