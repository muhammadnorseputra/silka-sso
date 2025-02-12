import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./services/providers";
import { ReactQueryProvider } from "./services/FetchQueryProvider";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "SSO - SILKa Online",
  description: "Login Aplikasi Layanan Integrasi SILKa",
};
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${roboto.className} antialiased`}>
        <Providers>
          <ReactQueryProvider>
            {children}
            <Toaster />
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
