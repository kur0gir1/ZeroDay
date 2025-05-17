/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        monoska: ['Monoska', 'monospace'],
        reno: ['RenoMono', 'monospace'],
      },
      colors: {
        glitchGreen1: '#00ff00',
        glitchGreen2: '#39ff14',
        glitchGreen3: '#0aff9d',
      },
      animation: {
        glitch: 'glitch 1s infinite',
      },
      keyframes: {
        glitch: {
          '0%': { textShadow: '2px 0 #0f0, -2px 0 #0f0' },
          '20%': { textShadow: '-2px 0 #39ff14, 2px 0 #0aff9d' },
          '40%': { textShadow: '2px 0 #0aff9d, -2px 0 #39ff14' },
          '60%': { textShadow: '-2px 0 #0f0, 2px 0 #39ff14' },
          '80%': { textShadow: '2px 0 #0f0, -2px 0 #0aff9d' },
          '100%': { textShadow: '-2px 0 #0f0, 2px 0 #0f0' },
        },
      }
    },
  },
  plugins: [],
}
