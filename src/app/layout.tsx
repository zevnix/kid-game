import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aprende Jugando - Diversión para Niños",
  description: "Un juego interactivo para aprender matemáticas, colores, formas y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={clsx(
          quicksand.variable,
          "font-sans antialiased min-h-screen pb-10"
        )}
      >
        <main className="max-w-4xl mx-auto px-4 pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
