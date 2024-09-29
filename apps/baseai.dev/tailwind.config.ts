import { type Config } from 'tailwindcss';
import typographyStyles from './typography';

export default {
	content: ['./src/**/*.{js,mjs,jsx,ts,tsx,mdx}', './*.tsx'],
	darkMode: 'selector',
	theme: {
		fontSize: {
			'2xs': ['0.75rem', { lineHeight: '1.25rem' }],
			xs: ['0.8125rem', { lineHeight: '1.5rem' }],
			sm: ['0.875rem', { lineHeight: '1.5rem' }],
			base: ['1rem', { lineHeight: '1.75rem' }],
			lg: ['1.125rem', { lineHeight: '1.75rem' }],
			xl: ['1.25rem', { lineHeight: '1.75rem' }],
			'2xl': ['1.5rem', { lineHeight: '2rem' }],
			'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
			'5xl': ['3rem', { lineHeight: '1' }],
			'6xl': ['3.75rem', { lineHeight: '1' }],
			'7xl': ['4.5rem', { lineHeight: '1' }],
			'8xl': ['6rem', { lineHeight: '1' }],
			'9xl': ['8rem', { lineHeight: '1' }]
		},
		typography: typographyStyles,
		extend: {
			screens: {
				'3xl': '1700px'
			},
			boxShadow: {
				glow: '0 0 4px rgb(0 0 0 / 0.1)'
			},
			maxWidth: {
				lg: '33rem',
				'2xl': '40rem',
				'3xl': '50rem',
				'5xl': '66rem'
			},
			opacity: {
				1: '0.01',
				2.5: '0.025',
				7.5: '0.075',
				15: '0.15'
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
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
				// light mode
				tremor: {
					brand: {
						faint: '#eff6ff', // blue-50
						muted: '#bfdbfe', // blue-200
						subtle: '#60a5fa', // blue-400
						DEFAULT: '#3b82f6', // blue-500
						emphasis: '#1d4ed8', // blue-700
						inverted: '#ffffff' // white
					},
					background: {
						muted: '#f9fafb', // gray-50
						subtle: '#f3f4f6', // gray-100
						DEFAULT: '#ffffff', // white
						emphasis: '#374151' // gray-700
					},
					border: {
						DEFAULT: '#e5e7eb' // gray-200
					},
					ring: {
						DEFAULT: '#e5e7eb' // gray-200
					},
					content: {
						subtle: '#9ca3af', // gray-400
						DEFAULT: '#6b7280', // gray-500
						emphasis: '#374151', // gray-700
						strong: '#111827', // gray-900
						inverted: '#ffffff' // white
					}
				},
				// dark mode
				'dark-tremor': {
					brand: {
						faint: 'hsl(var(--background))', // custom
						muted: 'hsl(var(--muted))', // blue-950
						subtle: '#1e40af', // blue-800
						DEFAULT: '#3b82f6', // blue-500
						emphasis: '#60a5fa', // blue-400
						inverted: 'hsl(var(--muted))' // gray-950
					},
					background: {
						muted: 'hsl(var(--muted))', // custom
						subtle: 'hsl(var(--muted))', // gray-800
						DEFAULT: 'hsl(var(--background))', // gray-900
						emphasis: '#d1d5db' // gray-300
					},
					border: {
						DEFAULT: 'hsl(var(--border))' // gray-800
					},
					ring: {
						DEFAULT: 'hsl(var(--muted))' // gray-800
					},
					content: {
						subtle: '#4b5563', // gray-600
						DEFAULT: '#6b7280', // gray-600
						emphasis: '#e5e7eb', // gray-200
						strong: '#f9fafb', // gray-50
						inverted: '#000000' // black
					}
				}
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [
		require('tailwindcss-animate'),
		require('@headlessui/tailwindcss'),
		require('@tailwindcss/typography')
	]
} satisfies Config;
