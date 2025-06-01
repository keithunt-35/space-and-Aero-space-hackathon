/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        accent: 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        dark: '#1A1B1E',
        'dark-lighter': '#2C2D31',
        'dark-card': '#25262B',
        'dark-border': '#373A40',
      },
      animation: {
        'float-clouds': 'float-clouds 6s ease-in-out infinite',
        'float-plane1': 'float-plane1 8s ease-in-out infinite',
        'float-plane2': 'float-plane2 7s ease-in-out infinite',
      },
      keyframes: {
        'float-clouds': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-plane1': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -10px)' },
        },
        'float-plane2': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-20px, 10px)' },
        },
      },
    },
  },
  plugins: [],
} 