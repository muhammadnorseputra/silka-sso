"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
// 1. import `HeroUIProvider` component
import { HeroUIProvider } from "@heroui/react";
import { ReCaptchaProvider } from "next-recaptcha-v3";

export default function Providers({ children }: { children: React.ReactNode }) {
  
  return (
    <ReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
    >
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </NextThemesProvider>
    </ReCaptchaProvider>
  );
}
