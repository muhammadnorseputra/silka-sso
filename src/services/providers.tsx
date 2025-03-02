"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider
          placement="top-center"
          toastOffset={20}
          toastProps={{
            classNames: {
              closeButton:
                "opacity-50 absolute right-2 top-1/2 -translate-y-1/2",
            },
            closeIcon: (
              <svg
                fill="none"
                height="32"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="32">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ),
          }}
        />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
