/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        monoska: ["Monoska", "monospace"],
        reno: ["RenoMono", "monospace"],
      },
      colors: {
        glitchGreen1: "#00ff00",
        glitchGreen2: "#39ff14",
        glitchGreen3: "#0aff9d",
      },
      animation: {
        glitch: "glitch 1s infinite",
        scanline: "scanlineMove 2s linear infinite",
        glitchTransform: "glitch 0.5s infinite alternate-reverse",
        answerCorrect: "answerCorrect 0.6s ease-in-out infinite",
        pulseSlow: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        typewriter: "typing 3.5s steps(40, end)",
        cursor: "blink 0.75s step-end infinite",
      },
      keyframes: {
        glitch: {
          "0%": { textShadow: "2px 0 #0f0, -2px 0 #0f0" },
          "20%": { textShadow: "-2px 0 #39ff14, 2px 0 #0aff9d" },
          "40%": { textShadow: "2px 0 #0aff9d, -2px 0 #39ff14" },
          "60%": { textShadow: "-2px 0 #0f0, 2px 0 #39ff14" },
          "80%": { textShadow: "2px 0 #0f0, -2px 0 #0aff9d" },
          "100%": { textShadow: "-2px 0 #0f0, 2px 0 #0f0" },
        },
        scanlineMove: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(2px)" },
        },
        glitchTransform: {
          "0%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-1px, 1px)" },
          "40%": { transform: "translate(-2px, -1px)" },
          "60%": { transform: "translate(1px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(-1px, 1px)" },
        },
        answerCorrect: {
          "0%, 100%": { boxShadow: "0 0 8px #00ff00" },
          "50%": { boxShadow: "0 0 20px #00ff00" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#00ff00" },
        },
      },
      // Add custom utilities for glitch effects
      rotate: {
        '180': '180deg',
      },
      filter: {
        'invert': 'invert(1) hue-rotate(180deg)',
      },
      cursor: {
        'hacker': "url('/cursor-hacker.png'), auto",
        'hacker-glitch': "url('/cursor-hacker-glitch.png'), auto",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glitch-flip': {
          transform: 'rotate(180deg)',
          transition: 'transform 0.5s',
        },
        '.glitch-font': {
          fontFamily: "'monospace', 'Wingdings', 'Webdings', 'Symbol', sans-serif !important",
          letterSpacing: '0.2em',
        },
        '.glitch-invert': {
          filter: 'invert(1) hue-rotate(180deg) !important',
        },
        '.glitch-fake-progress': {
          transition: 'width 0.2s',
        },
      });
    },
  ],
};
