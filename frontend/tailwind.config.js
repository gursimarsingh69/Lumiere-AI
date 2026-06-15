/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F14',
        bg2: '#111820',
        slate: {
          light: '#343A40',
          mid: '#252C35',
          dark: '#1A2030',
        },
        teal: {
          DEFAULT: '#008080',
          bright: '#00A8A8',
          glow: '#00BFBF',
          dim: '#005555',
        },
        gold: '#C8A96E',
        redflag: '#E05A5A',
        greenok: '#4CAF82',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'spin-slow-reverse': 'spin 8s linear infinite reverse',
        'pulse-orb': 'pulseOrb 3s ease-in-out infinite',
      },
      keyframes: {
        pulseOrb: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
