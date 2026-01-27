/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hunter-green': 'var(--hunter-green)',
        'sage-green': 'var(--sage-green)',
        'yellow-green': 'var(--yellow-green)',
        'vanilla-cream': 'var(--vanilla-cream)',
        'blushed-brick': 'var(--blushed-brick)',
      },
    },
  },
  plugins: [],
}