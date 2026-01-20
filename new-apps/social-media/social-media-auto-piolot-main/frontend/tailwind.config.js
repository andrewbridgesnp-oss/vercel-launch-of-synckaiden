/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#27272A',
        input: '#27272A',
        ring: '#0EA5E9',
        background: '#050505',
        foreground: '#FAFAFA',
        primary: {
          DEFAULT: '#0EA5E9',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#18181B',
          foreground: '#FAFAFA',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FAFAFA',
        },
        muted: {
          DEFAULT: '#27272A',
          foreground: '#A1A1AA',
        },
        accent: {
          DEFAULT: '#27272A',
          foreground: '#FAFAFA',
        },
        popover: {
          DEFAULT: '#0F0F0F',
          foreground: '#FAFAFA',
        },
        card: {
          DEFAULT: '#0F0F0F',
          foreground: '#FAFAFA',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        mono: ['Azeret Mono', 'monospace'],
        sans: ['Manrope', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      boxShadow: {
        'primary-glow': '0 0 20px rgba(14, 165, 233, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}