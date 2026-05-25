/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#faf7f2',
          100: '#f5ede0',
          200: '#e8dcc8',
          300: '#d4c4a8',
        },
        ocean: {
          50: '#edf5f5',
          100: '#d4e8e8',
          200: '#a8cfcf',
          500: '#1a6b6b',
          600: '#145555',
          700: '#0f4444',
          800: '#0a3333',
          900: '#062626',
        },
        terracotta: {
          50: '#fdf3ef',
          100: '#f9e4db',
          400: '#d4704f',
          500: '#c45c3e',
          600: '#a84d34',
        },
        ink: {
          DEFAULT: '#2a2520',
          muted: '#5c5349',
          light: '#8a8078',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.625rem',
        xl: '0.75rem',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(42, 37, 32, 0.06)',
        card: '0 4px 24px rgba(42, 37, 32, 0.08)',
        elevated: '0 8px 32px rgba(42, 37, 32, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'ken-burns': 'kenBurns 22s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate',
        'glow-pulse': 'glowPulse 3s cubic-bezier(0.37, 0, 0.63, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1.05) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.14) translate3d(-1%, -1%, 0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 4px 24px rgba(196, 92, 62, 0.15)' },
          '50%': { boxShadow: '0 6px 32px rgba(196, 92, 62, 0.35)' },
        },
      },
    },
  },
  plugins: [],
};
