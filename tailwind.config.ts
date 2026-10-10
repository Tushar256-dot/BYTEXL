import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        muted: {
          DEFAULT: '#18181b',
          foreground: '#a1a1aa',
        },
        card: {
          DEFAULT: '#121215',
          foreground: '#fafafa',
          elevated: '#1a1a20',
          border: '#27272a',
        },
        border: '#27272a',
        input: '#27272a',
        ring: '#ccff00',
        lime: {
          accent: '#ccff00',
          glow: 'rgba(204, 255, 0, 0.15)',
          hover: '#b8e600',
        },
        violet: {
          accent: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.15)',
          hover: '#7c3aed',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-lime': '0 0 24px -4px rgba(204, 255, 0, 0.2)',
        'glow-violet': '0 0 24px -4px rgba(139, 92, 246, 0.25)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
