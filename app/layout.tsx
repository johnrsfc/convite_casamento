import type { Metadata } from "next";
import "./globals.css";

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
      </body>
    </html>
  );
}
