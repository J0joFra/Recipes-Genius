/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': 'var(--ink-black)',
        'prussian-blue': 'var(--prussian-blue)',
        'dusk-blue': 'var(--dusk-blue)',
        'dusty-denim': 'var(--dusty-denim)',
        'alabaster-grey': 'var(--alabaster-grey)',
      },
    },
  },
  plugins: [],
}