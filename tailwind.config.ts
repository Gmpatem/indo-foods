import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#f97316',
          secondary: '#ea580c',
          accent: '#fb923c',
          dark: '#9a3412',
        },
      },
    },
  },
  plugins: [],
};

export default config;
