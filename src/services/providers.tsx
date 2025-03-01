"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider placement="top-center" toastOffset={20} />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
