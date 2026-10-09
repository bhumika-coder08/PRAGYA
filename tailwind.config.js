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
          950: '#080c14',
          900: '#0d131f',
          850: '#121927',
          800: '#172235',
          750: '#1e2b42',
          700: '#263753',
          600: '#384d70',
          500: '#526689',
        },
        scientific: {
          surface: '#0d131f',
          card: '#121927',
          panel: '#172235',
          border: '#1e2b42',
          borderLight: '#2c3e5d',
          muted: '#94a3b8',
          text: '#f1f5f9',
          highlight: '#ffffff',
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
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(56, 189, 248, 0.08) 1px, transparent 1px)",
        'contour-gradient': "linear-gradient(180deg, rgba(15, 20, 28, 0.8) 0%, rgba(11, 15, 20, 0.95) 100%)",
      },
    },
  },
  plugins: [],
}
