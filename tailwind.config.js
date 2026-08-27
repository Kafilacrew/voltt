/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      colors: {
        voltt: {
          navy: '#2A1646',
          navydark: '#1F0F36',
          coral: '#F95738',
          coralhover: '#E04729',
          cream: '#F5F2EB',
          creamcard: '#FAF8F3',
          creamborder: '#E6DFD3',
          gold: '#D9A441',
          green: '#5D8C4A',
          charcoal: '#2A1646',
          muted: '#71717A',
        },
        brand: {
          navy: '#2A1646',
          coral: '#F95738',
          gold: '#D9A441',
          green: '#5D8C4A',
        },
      },
      boxShadow: {
        'subtle': '0 2px 12px rgba(42, 22, 70, 0.04)',
        'elevated': '0 20px 40px -15px rgba(42, 22, 70, 0.1)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
