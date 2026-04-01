import type { Config } from 'tailwindcss'

const config: Config = {
  // CRITICAL: darkMode phải là 'class' không phải 'media'
  darkMode: 'class',
  
  content: [
    // Phải có đủ tất cả paths này:
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',  // thêm nếu dùng /src folder
  ],
  
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          DEFAULT: '#00D4B4',
        },
        brand: {
          teal: '#00D4B4',
          amber: '#F59E0B',
          coral: '#FF6B6B',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam)', 'Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
        display: ['var(--font-be-vietnam)', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-slide-in': 'fadeSlideIn 0.5s ease forwards',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 212, 180, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0, 212, 180, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeSlideIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config

