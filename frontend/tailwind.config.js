/** @type {import('tailwindcss').Config} */
export default {
  // Add dark mode with 'class' strategy for manual toggling
  darkMode: ["class"],
  // This is where Tailwind finds your classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JS/TS/JSX/TSX files
  ],
  theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
  colors: {
    border: '#335C67',
    input: '#FFF3B0',
    ring: '#9E2A2B',
    background: '#FFF3B0',
    foreground: '#540B0E',
    primary: {
      DEFAULT: '#FFF3B0',
      foreground: '#540B0E',
      light: '#FFF8D1',
      dark: '#E6D99A'
    },
    secondary: {
      DEFAULT: '#E09F3E',
      foreground: '#540B0E',
      light: '#E8B366',
      dark: '#C88A2E'
    },
    success: {
      DEFAULT: '#335C67',
      foreground: '#FFF3B0',
      light: '#4A7A85'
    },
    destructive: {
      DEFAULT: '#9E2A2B', // Using accent color for destructive actions
      foreground: '#FFF3B0'
    },
    muted: {
      DEFAULT: '#E09F3E',
      foreground: '#540B0E'
    },
    accent: {
      DEFAULT: '#9E2A2B',
      foreground: '#FFF3B0'
    },
    popover: {
      DEFAULT: '#FFF3B0',
      foreground: '#540B0E'
    },
    card: {
      DEFAULT: '#FFF3B0',
      foreground: '#540B0E'
    },
    sidebar: {
      DEFAULT: '#540B0E',
      foreground: '#FFF3B0',
      primary: '#FFF3B0',
      'primary-foreground': '#540B0E',
      accent: '#E09F3E',
      'accent-foreground': '#540B0E',
      border: '#335C67',
      ring: '#9E2A2B'
    }
  },
  backgroundImage: {
    'gradient-hero': 'linear-gradient(135deg, #FFF3B0, #E09F3E)',
    'gradient-warm': 'linear-gradient(135deg, #E09F3E, #9E2A2B)',
    'gradient-success': 'linear-gradient(135deg, #335C67, #540B0E)'
  },
  boxShadow: {
    soft: '0 4px 6px -1px rgba(84, 11, 14, 0.1), 0 2px 4px -1px rgba(84, 11, 14, 0.06)',
    medium: '0 10px 15px -3px rgba(84, 11, 14, 0.1), 0 4px 6px -2px rgba(84, 11, 14, 0.05)',
    large: '0 20px 25px -5px rgba(84, 11, 14, 0.1), 0 10px 10px -5px rgba(84, 11, 14, 0.04)'
  },
  borderRadius: {
    lg: '0.5rem',
    md: '0.25rem',
    sm: '0.125rem'
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
	plugins: [require("tailwindcss-animate")],
};
