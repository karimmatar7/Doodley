import type { Metadata } from "next";
import { Kalam, Roboto } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Doodley, Draw & Guess",
  description: "Doodley is a fun and interactive online drawing and guessing game where players can showcase their artistic skills and creativity. Join the game, draw your best doodles, and challenge your friends to guess what you've drawn!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${kalam.variable} ${roboto.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
