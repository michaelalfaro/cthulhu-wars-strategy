import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cthulhu Wars Strategy Guide",
  description:
    "A comprehensive strategy guide for the Cthulhu Wars board game. Faction guides, unit analysis, map strategies, and advanced tactics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-void text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
