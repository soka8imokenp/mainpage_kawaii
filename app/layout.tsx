import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "KawaiiUZ - Olamingizni Kashf Eting",
  description: "Anime, manga va manhwa platformasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${spaceGrotesk.variable} font-sans antialiased bg-[#0b090f] text-[#e5e5e5] min-h-screen`}>
        {children}
      </body>
    </html>
  );
}