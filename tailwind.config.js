/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        footer: "var(--color-footer)",
        "footer-text": "var(--color-footer-text)",
        "footer-text-hover": "var(--color-footer-text-hover)",
      },
    },
  },
  plugins: [],
};
