/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        /* Brand palette — azul-petróleo + bege/dourado discreto, off-white */
        brand: {
          50: '#f5f8f9',
          100: '#e3edef',
          200: '#c1d7dc',
          300: '#95b9c1',
          400: '#5f8f9a',
          500: '#3f7079',
          600: '#2f5a63',
          700: '#28484f',
          800: '#243b41',
          900: '#1f3237',
          950: '#0f1b1e',
        },
        accent: {
          50: '#fbf8f2',
          100: '#f3ead6',
          200: '#e6d3ab',
          300: '#d6b878',
          400: '#c69d55',
          500: '#b78640',
          600: '#9a6d34',
          700: '#7b562d',
          800: '#654628',
          900: '#543a24',
        },
        surface: {
          DEFAULT: '#fdfcfa',
          muted: '#f6f4ef',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(31,50,55,0.05), 0 8px 24px -12px rgba(31,50,55,0.12)',
        soft: '0 1px 3px rgba(31,50,55,0.08)',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};
