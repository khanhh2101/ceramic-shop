/** @type {import('tailwindcss').Config} */
export default {
  // Quét tất cả file .jsx, .js, .html để tìm class Tailwind
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ── Màu sắc thương hiệu Gốm Nâu ──
      colors: {
        // Màu chính: nâu đất gốm (Champa Clay)
        primary: {
          50: '#f7f4f1',
          100: '#ebe3dc',
          200: '#d2bdae',
          300: '#b5947b',
          400: '#9b6c4b',
          500: '#845334',
          600: '#5c3a21',  // Màu chính Champa Clay
          700: '#462c19',
          800: '#321f12',
          900: '#1e120b',
        },
        // Màu đất nung (accent)
        clay: {
          50: '#fdf7f4',
          100: '#f9ece4',
          200: '#f1d4c3',
          300: '#e7b49a',
          400: '#d9896c',
          500: '#c96647',
          600: '#b5624a',
          700: '#924a36',
          800: '#783d2e',
          900: '#633328',
        },
        // Màu nền kem/trắng ngà
        cream: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#faf0e0',
          300: '#f5e3c8',
          400: '#edd3ac',
          500: '#e3bf8e',
          600: '#d4a56c',
          700: '#b8864d',
          800: '#976a38',
          900: '#7a5430',
        },
        // Màu xanh lá (cho badge "Mới", "Freeship")
        leaf: {
          50: '#f0f9f4',
          500: '#22a65d',
          600: '#1a8f4e',
        }
      },

      // ── Font ──
      fontFamily: {
        sans: ['Inter', 'Be Vietnam Pro', 'ui-sans-serif', 'system-ui'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },

      // ── Kích thước container ──
      maxWidth: {
        'screen-xl': '1280px',
      },

      // ── Box shadow ──
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.10)',
        'nav': '0 1px 3px rgba(0,0,0,0.08)',
      },

      // ── Animation ──
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 1.5s infinite linear',
      },

      // ── Aspect ratio ──
      aspectRatio: {
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};
