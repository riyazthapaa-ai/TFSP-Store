import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#060606",
        card: "#0e0e0e",
        border: "#1e1e1e",
        muted: "#a3a3a3",
        accent: "#dc143c",
        accentSoft: "#f43f5e",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255,255,255,0.08)",
        accent: "0 0 24px rgba(220,20,60,0.38)",
      },
      backgroundImage: {
        "radial-dark":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0) 35%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
