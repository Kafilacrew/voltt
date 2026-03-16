/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#e73642',
          yellow: '#ffbb29',
          brown: '#d5875d',
          teal: '#2ec2b1',
        },
        earthx: {
          dark: '#1f1f1f',
          muted: '#6b6b6b',
          border: '#e6e6e6',
          bg: '#f5f5f5',
        },
      },
      boxShadow: {
        'card': '0 4px 14px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.12)',
        'deal': '0 4px 17.5px rgba(255,187,41,0.3)',
        'nav': '0 8px 22px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
