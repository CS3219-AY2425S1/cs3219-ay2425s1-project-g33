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
        difficulty: {
          "easy": "var(--difficulty-easy)",
          "medium": "var(--difficulty-medium)",
          "hard": "var(--difficulty-hard)",
        },
        background: {
          DEFAULT: "var(--background)",
          100: "var(--background-100)",
          200: "var(--background-200)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          100: "var(--foreground-100)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: {
            DEFAULT: "var(--card-foreground)",
            100: "var(--card-foreground-100)",
          },
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: {
          DEFAULT: "var(--input)",
          background: {
            100: "var(--input-background-100)",
          },
        },
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
          "difficulty-easy": "var(--chart-difficulty-easy)",
          "difficulty-medium": "var(--chart-difficulty-medium)",
          "difficulty-hard": "var(--chart-difficulty-hard)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
