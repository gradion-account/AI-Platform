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
          orange: "#FF6B00",
          "orange-dark": "#E05A00",
          beige: "#F2EEE7",
          white: "#F9F9F9",
          black: "#231F20",
        },
      },
      fontFamily: {
        sans: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
