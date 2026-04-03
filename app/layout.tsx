import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { getOption } from "@/lib/actions/options";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getOption("favicon");
  
  return {
    title: "MERPATI CMS",
    description: "Media Editorial Ringkas, Praktis, Aman, Tetap Independen",
    icons: {
      icon: faviconUrl || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = await getOption("gtm_id");
  const gaId = await getOption("ga_id");
  const cfToken = await getOption("cf_analytics_token");
  return (
    <html lang="id" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {cfToken && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfToken}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
