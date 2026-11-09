/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trivviu: {
          blue: "#0878D1",
          blueDark: "#1267B0",
          orange: "#FF7900",
          orangeHover: "#E66D00",
          dark: "#17243A",
          gray: "#6B7280",
          lightGray: "#F5F8FC",
          border: "#E5E7EB",
          cardBg: "#FFFFFF"
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'search': '0 20px 40px -15px rgba(8, 120, 209, 0.15), 0 10px 20px -10px rgba(23, 36, 58, 0.08)',
        'card': '0 4px 20px -2px rgba(23, 36, 58, 0.08), 0 2px 6px -1px rgba(23, 36, 58, 0.04)',
        'card-hover': '0 20px 30px -10px rgba(8, 120, 209, 0.18), 0 10px 15px -5px rgba(23, 36, 58, 0.08)',
      }
    },
  },
  plugins: [],
}
