import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["-apple-system", "SF Pro Display", "BlinkMacSystemFont", "Helvetica Neue", "Arial", "sans-serif"],
        body:    ["-apple-system", "SF Pro Text",    "BlinkMacSystemFont", "Helvetica Neue", "Arial", "sans-serif"],
        mono:    ["-apple-system", "SF Pro Text",    "BlinkMacSystemFont", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          green: "#1A7A4A",
          yellow: "#F4B942",
          blue: "#3B82F6",
          red: "#E5534B",
          purple: "#8B5CF6",
        },
      },
      borderRadius: {
        lg:   "var(--radius-lg)",
        md:   "var(--radius-md)",
        sm:   "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
      },
      boxShadow: {
        card: "0 2px 16px rgba(0, 0, 0, 0.06)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.22s cubic-bezier(0.4,0,0.2,1)",
        "accordion-up":   "accordion-up   0.22s cubic-bezier(0.4,0,0.2,1)",
        "fade-in-up":     "fade-in-up 0.52s cubic-bezier(0.4,0,0.2,1) forwards",
        "fade-in":        "fade-in    0.40s cubic-bezier(0.4,0,0.2,1) forwards",
        "slide-down":     "slide-down 0.26s cubic-bezier(0.4,0,0.2,1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
