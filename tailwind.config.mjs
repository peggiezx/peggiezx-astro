// tailwind.config.mjs
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import { defineConfig } from "tailwindcss";

export default defineConfig({
  // 1. Tell Tailwind which files to scan
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  // 2. Define your theme
  theme: {
    // 2a. Override the default sans/mono so `font-sans` and `font-mono` exist
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      mono: ["monospace", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      // 2b. Hook your CSS-var palette into Tailwind colors
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        accent: "var(--accent)",
        "code-bg": "var(--code-bg)",
        border: "var(--border)",
      },
    },
  },
  // 3. Any plugins you need
  plugins: [typography],
});
