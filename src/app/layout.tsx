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
  metadataBase: new URL("https://historias-six.vercel.app"),
  title: {
    default: "Ficción Oculta — Historias de suspense, intriga y aventura",
    template: "%s · Ficción Oculta",
  },
  description:
    "Historias originales de suspense, intriga, aventura y acción para leer capítulo a capítulo.",
  applicationName: "Ficción Oculta",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Ficción Oculta",
    title: "Ficción Oculta",
    description:
      "Historias originales de suspense, intriga, aventura y acción para leer capítulo a capítulo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ficción Oculta",
    description:
      "Historias originales de suspense, intriga, aventura y acción para leer capítulo a capítulo.",
  },
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
