/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'maven-pro': ['Maven Pro', 'sans-serif'],
      },
      colors: {
        'custom-primary':'#FCFBFB',
        'custom-secondary':'#313539',
        'custom-tertiary':'#7B7E80',
        'custom-quaternary':'#4B9AB7',
        'custom-quinary':'#F7E12C',
      },
      boxShadow:{
        'custom-quas': '0px 3px 6px #4B9AB7, 0px 3px 6px #4B9AB7',
        'custom-dashboard' : '#FCFBFB 0px 1px 5px',
        'custom-option-dashboar' : '#313539 0px 1px 5px',
        'custom-inset': '#313539 1px 1px 1px 0px inset, #313539 -1px -1px 1px 0px inset',
      }
    },
  },
  plugins: [],
}

