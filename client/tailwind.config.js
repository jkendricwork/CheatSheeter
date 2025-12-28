/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        warning: '#dc3545',
        success: '#27ae60',
        'best-practices': '#ffc107',
      },
    },
  },
  plugins: [],
}
