import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ModuleBackNav } from "@next-modular-arch/ui-data/module-back-nav/ModuleBackNav";

import { AppProviders } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokéAPI",
  description: "Listagem de Pokémon via PokéAPI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-[var(--color-background)] antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>
          <ModuleBackNav />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
