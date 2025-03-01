import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactQueryProvider } from "@/services/FetchQueryProvider";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";
import Providers from "@/services/providers";

export const metadata: Metadata = {
  title: "Single Sign On | SILKa Online",
  description: "SSO Layanan Kepegawaian Integrasi SILKa",
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
