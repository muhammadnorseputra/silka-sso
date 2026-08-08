import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactQueryProvider } from "@/services/FetchQueryProvider";
import { Geist, Source_Code_Pro } from "next/font/google";
import Providers from "@/services/providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Single Sign On | SILKa Online",
  description: "SSO Layanan Kepegawaian Integrasi SILKa",
};

const mono = Source_Code_Pro({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
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
      className={`${mono.variable} ${geist.variable}`}
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
