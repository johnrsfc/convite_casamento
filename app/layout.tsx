import type { Metadata } from "next";
import "./globals.css";
import MusicWrapper from "./components/MusicWrapper";

export const metadata: Metadata = {
  title: "Larissa & Jonathan | Casamento",
  description: "Convite de casamento de Larissa & Jonathan - 18 de Abril de 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <MusicWrapper />
      </body>
    </html>
  );
}
