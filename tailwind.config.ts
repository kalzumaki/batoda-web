import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkGreen: "#2d665f",
        teal: "#469c8f",
        lightGreen: "#62a287",
        lightTeal: "#c6d9d7",
      },
    },
  },
  plugins: [],
};
export default config;
