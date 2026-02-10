import type { Metadata } from "next";
import "./globals.css";
import MusicWrapper from "./components/MusicWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://convite-casamento-indol.vercel.app"),
  title: "Larissa & Jonathan | Casamento",
  description: "Convite de casamento de Larissa & Jonathan - 18 de Abril de 2026",
  icons: {
    icon: "/Img01.png",
    apple: "/Img01.png",
  },
  openGraph: {
    title: "Larissa & Jonathan | Casamento",
    description: "18 de Abril de 2026 • Mansão O Casarão",
    images: [{ url: "https://convite-casamento-indol.vercel.app/Img01.png", width: 800, height: 800 }],
    type: "website",
  },
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
