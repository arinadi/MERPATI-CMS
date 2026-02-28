import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MERPATI-CMS",
  description: "Media Editorial Ringkas, Praktis, Aman, Tetap Independen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
