/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E2238',
          light: '#16324F',
          lighter: '#1D3E5F',
        },
        paper: '#F6F5F1',
        line: '#E3E1D9',
        text: {
          DEFAULT: '#1B2430',
          muted: '#667085',
          faint: '#8B93A1',
        },
        brass: {
          DEFAULT: '#A9812F',
          light: '#C9A65B',
          dark: '#7E611F',
        },
        success: {
          DEFAULT: '#1F7A5C',
          bg: '#E7F3EE',
        },
        danger: {
          DEFAULT: '#B3261E',
          bg: '#FBEAE9',
        },
        warning: {
          DEFAULT: '#B7791F',
          bg: '#FBF1E1',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        none: 'none',
        panel: '0 1px 2px rgba(14, 34, 56, 0.06)',
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
        md: '6px',
      },
    },
  },
  plugins: [],
}
