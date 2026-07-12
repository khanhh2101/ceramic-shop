/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  // Quét tất cả file .jsx, .js, .html để tìm class Tailwind
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			primary: {
  				'50': '#f7f4f1',
  				'100': '#ebe3dc',
  				'200': '#d2bdae',
  				'300': '#b5947b',
  				'400': '#9b6c4b',
  				'500': '#845334',
  				'600': '#5c3a21',
  				'700': '#462c19',
  				'800': '#321f12',
  				'900': '#1e120b',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			clay: {
  				'50': '#fdf7f4',
  				'100': '#f9ece4',
  				'200': '#f1d4c3',
  				'300': '#e7b49a',
  				'400': '#d9896c',
  				'500': '#c96647',
  				'600': '#b5624a',
  				'700': '#924a36',
  				'800': '#783d2e',
  				'900': '#633328'
  			},
  			cream: {
  				'50': '#fefdfb',
  				'100': '#fdf8f0',
  				'200': '#faf0e0',
  				'300': '#f5e3c8',
  				'400': '#edd3ac',
  				'500': '#e3bf8e',
  				'600': '#d4a56c',
  				'700': '#b8864d',
  				'800': '#976a38',
  				'900': '#7a5430'
  			},
  			leaf: {
  				'50': '#f0f9f4',
  				'500': '#22a65d',
  				'600': '#1a8f4e'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'Be Vietnam Pro',
  				'ui-sans-serif',
  				'system-ui'
  			],
  			display: [
  				'Playfair Display',
  				'Georgia',
  				'serif'
  			]
  		},
  		maxWidth: {
  			'screen-xl': '1280px'
  		},
  		boxShadow: {
  			card: '0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
  			'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.10)',
  			nav: '0 1px 3px rgba(0,0,0,0.08)'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(8px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			}
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.3s ease-out',
  			'slide-up': 'slideUp 0.5s ease-out',
  			shimmer: 'shimmer 1.5s infinite linear'
  		},
  		aspectRatio: {
  			'4/3': '4 / 3',
  			'3/4': '3 / 4'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },

  plugins: [
    require('@tailwindcss/typography'),
    require("tailwindcss-animate"),
  ],
};
