// hero.ts
import { heroui } from "@heroui/react";
export default heroui({
  layout: {},
  themes: {
    light: {
      layout: {},
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
      },
    },
    dark: {
      layout: {},
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
      },
    },
  },
});
