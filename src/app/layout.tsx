import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Historias — Suspense, intriga y aventura",
    template: "%s · Historias",
  },
  description:
    "Historias originales de suspense, intriga, aventura y acción para leer capítulo a capítulo.",
  applicationName: "Historias",
  keywords: [
    "historias de suspense",
    "relatos de intriga",
    "historias de aventura",
    "ficción por capítulos",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
