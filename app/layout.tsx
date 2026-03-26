import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inma Álvarez | Arte Original",
  description: "Descubre obras únicas creadas a mano que llenarán de vida y personalidad cada rincón de tu hogar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
