const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "xs": "325px"
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'black': '#000',
        'blue-500': '#038ff7',
        'clay-black': '#000',
        'medium-purple': '#9170e6',
        'white': 'white',
        'slate-grey': '#676d7e',
        'alice-blue': '#f3f7fe',
        'white-4': '#f9fbfe',
        'cornsilk': '#fff6df',
        'coral': '#ff753c',
        'border': '#0259a71f',
        'indian-red': '#ed4f6a',
        'black-2': 'black',
        'medium-sea-green': '#27b871',
        'alice-gold': '#e4a224',
        'shadow': '#00000014',
        'light-grey': '#cdd0d8',
        'light-grey-2': '#cbcbcb',
        'slate-blue': '#8956be',
        'lime-green': '#1dad2c',
        'crimson': '#c33652',
        'dodger-blue': '#028ff7',
        'ghost-white-2': '#eef3ff',
        'tomato': '#ff5f57',
        'old-lace-2': '#fff6e2',
        'gainsboro': '#d9d9d9',
        'goldenrod-2': '#dfac47',
        'dodger-blue-4': '#3f8def',
        'mint-cream': '#ebf6ee',
        'dark-grey': '#a0a0a0',
        'slate-grey-4': '#676d7e',
        'sea-green': '#0a9e5c',
        'dodger-blue-2': '#2599fe',
        'white-smoke-2': '#f9f9f9',
        'gainsboro-2': '#e7e8ec',
        'dark-grey-2': '#a2a8b7',
        'ghost-white-3': '#eef3fe',
        'alice-blue-3': '#eef4ff',
        'white-5': '#f9fcfe',
        'ghost-white-6': '#f4f7fd',
        'medium-purple-3': '#aa70e6',
        'medium-purple-2': '#aa70e6',
        'crimson-2': '#cc3c58',
        'black': '#1d2026',
        'gray-600': '#717989',
        'ai-prompt': '#f5ebfd',
        'home-purple': '#aa70e6',
        'lavender': '#dee9ff',
        'blue-300': '#abc9fe',
        'blue-200': '#dee9ff',
        'purple-300': '#d7abff',
        'purple-200': '#e8cefe',
        'purple-600': '#8956be',
        'gray-border': '#e7e8ec',
        'gray-100': '#f6f6f8',
        'yellow-400': '#ffbd13',
        'yellow-300': '#fde097',
        'yellow-600': '#ffae13',
        'green-300': '#71dc95',
        'green-200': '#baf6c9',
        'blue-400': '#70abfe',
        'green-600': '#047e4a',
        'purple-400': '#a54fff',
        'gray-medium': '#a2a8b7',
        'gray-50': '#fbfbfc',
        'green-100': '#e6fce9',
        'purple-100': '#f5ebfd',
        'blue-100': '#f3f7fe',
        'yellow-200': '#fde9b5',
        'yellow-100': '#fff4d9',
        'purple-500': '#aa70e6',
        'blue-600': '#0667d9',
        'gray-500': '#979da9',
        'green-500': '#0a9e5c',
        'pink-400': '#ff7ad5',
        'orange-600': '#ff6b00',
        'green-400': '#2bbf71',
        'yellow-500': '#dbab2d',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'logo-cloud': {
       from: { transform: 'translateX(0)' },
       to: { transform: 'translateX(calc(-100% - 4rem))' },
     },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "file-add-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0px)", opacity: "1" },
        },
        "zoom-in": {
          from: { transform: "scale(1.2)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "text-gradient": {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "file-add-up": "file-add-up 0.3s ease-out",
        "zoom-in": "zoom-in 2s cubic-bezier(0.16, 1, 0.3, 1)",
        'logo-cloud': 'logo-cloud 30s linear infinite',
        'text-gradient': 'textGradient 5s ease infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};