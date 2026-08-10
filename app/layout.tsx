import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doodley, Draw & Guess",
  description: "Doodley is a fun and interactive online drawing and guessing game where players can showcase their artistic skills and creativity. Join the game, draw your best doodles, and challenge your friends to guess what you've drawn!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-blue text-gray-900 antialiased">{children}</body>
    </html>
  );
}