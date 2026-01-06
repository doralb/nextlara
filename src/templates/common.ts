export const PrismaClientTemplate = `import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`;

export const TailwindConfigTemplate = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./resources/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-inter)", "Inter", "sans-serif"],
        body: ["var(--font-comfortaa)", "Comfortaa", "cursive"],
      },
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        }
      }
    },
  },
  plugins: [],
};
export default config;
`;

export const GlobalsCssTemplate = `@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Inter:wght@100..900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-inter: 'Inter', sans-serif;
  --font-comfortaa: 'Comfortaa', cursive;
}

body {
  font-family: var(--font-comfortaa);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-inter);
}
`;
