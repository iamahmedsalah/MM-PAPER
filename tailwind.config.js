/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Core 3 brand swatches & warm paper shades
        midnight: '#0B1020',
        navy: '#193051',
        navyLight: '#22406B',
        gold: '#C9A86A',
        goldLight: '#E0C795',
        goldDark: '#9A7634',
        cream: '#F4EFE3',
        // Semantic dual-theme RGB tokens
        canvas: 'rgb(var(--color-bg) / <alpha-value>)',
        canvasAlt: 'rgb(var(--color-bg-alt) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surfaceHover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
        contrastBand: 'rgb(var(--color-contrast-band) / <alpha-value>)',
        contrastInk: 'rgb(var(--color-contrast-ink) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        inkMuted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
        inkSubtle: 'rgb(var(--color-ink-subtle) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accentStrong: 'rgb(var(--color-accent-strong) / <alpha-value>)',
        accentInk: 'rgb(var(--color-accent-ink) / <alpha-value>)',
        line: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
