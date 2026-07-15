module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: '#0b1220',
        accent: '#4EE1A0',
        glow: '#7C5CFF'
      },
      boxShadow: {
        'neon': '0 0 18px rgba(124,92,255,0.24), 0 6px 24px rgba(0,0,0,0.6)'
      }
    }
  },
  plugins: []
}
