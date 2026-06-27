import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactQueryProvider } from "@/services/FetchQueryProvider";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono, Geist } from "next/font/google";
import Providers from "@/services/providers";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Single Sign On | SILKa Online",
  description: "SSO Layanan Kepegawaian Integrasi SILKa",
};

const display = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={cn(display.variable, body.variable, mono.variable, "font-sans", geist.variable)}
    >
      <body className="antialiased">
        <Providers>
          <ReactQueryProvider>
            <Toaster />
            {children}
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
