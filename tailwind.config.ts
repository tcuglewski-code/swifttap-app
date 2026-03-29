import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A2744",
          50: "#E8EAF0",
          100: "#C5CAD9",
          200: "#9EA8C1",
          300: "#7786A9",
          400: "#596C96",
          500: "#3B5283",
          600: "#2F4169",
          700: "#1A2744",
          800: "#131D33",
          900: "#0D1322",
        },
        accent: {
          DEFAULT: "#00C9B1",
          50: "#E6FBF8",
          100: "#B3F3EC",
          200: "#80EBE0",
          300: "#4DE3D3",
          400: "#26DBC9",
          500: "#00C9B1",
          600: "#00A08D",
          700: "#007769",
          800: "#004E45",
          900: "#002522",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
