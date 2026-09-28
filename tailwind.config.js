/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#07090d',
          900: '#0b0f14',
          850: '#10151c',
          800: '#151b24',
          750: '#1b232f',
          700: '#222b39',
          600: '#323e50',
          500: '#475569',
        },
        scientific: {
          surface: '#0f141c',
          card: '#141a24',
          panel: '#18212e',
          border: '#222f40',
          borderLight: '#304259',
          muted: '#8493a8',
          text: '#e2e8f0',
          highlight: '#f8fafc',
        },
        observation: {
          light: '#7dd3fc',
          DEFAULT: '#38bdf8',
          dark: '#0284c7',
        },
        predictability: {
          light: '#c084fc',
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
        },
        watch: {
          light: '#fcd34d',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        danger: {
          light: '#fca5a5',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        stable: {
          light: '#6ee7b7',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(56, 189, 248, 0.08) 1px, transparent 1px)",
        'contour-gradient': "linear-gradient(180deg, rgba(15, 20, 28, 0.8) 0%, rgba(11, 15, 20, 0.95) 100%)",
      },
    },
  },
  plugins: [],
}
