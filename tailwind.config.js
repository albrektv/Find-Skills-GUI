/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          muted: 'var(--color-surface-muted)',
          hover: 'var(--color-surface-hover)'
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)'
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)'
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)'
        },
        success: {
          DEFAULT: 'var(--color-success)',
          soft: 'var(--color-success-soft)'
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          soft: 'var(--color-danger-soft)'
        },
        skill: {
          DEFAULT: 'var(--color-skill)',
          soft: 'var(--color-skill-soft)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'Segoe UI', 'Tahoma', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      },
      boxShadow: {
        glow: '0 0 40px -10px var(--color-accent)',
        card: 'var(--ds-shadow-card-soft)',
        'card-strong': 'var(--ds-shadow-card-strong)',
        shell: 'var(--ds-shadow-shell)',
        panel: 'var(--ds-shadow-panel)',
        composer: 'var(--ds-shadow-composer)'
      },
      borderRadius: {
        lg: 'var(--app-radius-md)',
        xl: 'var(--app-radius-lg)',
        '2xl': 'var(--app-radius-xl)',
        '3xl': 'var(--app-radius-2xl)'
      }
    }
  },
  plugins: []
}
