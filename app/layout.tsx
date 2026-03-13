import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SITE_CONFIG } from "@/config";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  openGraph: {
    type: SITE_CONFIG.openGraph.type,
    title: SITE_CONFIG.openGraph.title,
    description: SITE_CONFIG.openGraph.description,
    siteName: SITE_CONFIG.openGraph.siteName,
    locale: SITE_CONFIG.locale,
  },
  twitter: {
    card: SITE_CONFIG.twitter.card,
    title: SITE_CONFIG.twitter.title,
    description: SITE_CONFIG.twitter.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={SITE_CONFIG.locale}>
      <body className={`${dmSans.className} antialiased bg-[#232323]`}>
        {children}
      </body>
    </html>
  );
}
