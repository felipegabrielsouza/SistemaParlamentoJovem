import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parlamento Jovem Mococa",
  description: "Sistema de Processo Legislativo do Parlamento Jovem de Mococa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
