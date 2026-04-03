import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { getCachedOptions } from "@/lib/queries/options";
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
  const tracking = await getCachedOptions(["gtm_id", "ga_id", "cf_analytics_token"]);
  const gtmId = tracking.gtm_id;
  const gaId = tracking.ga_id;
  const cfToken = tracking.cf_analytics_token;
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
