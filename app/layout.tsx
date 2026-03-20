import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SITE_CONFIG } from "@/config";
import { LoadingScreen } from "@/components/ui";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
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
    <html lang={SITE_CONFIG.locale} suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased bg-bg-primary text-text-primary`}>
        <ThemeProvider>
          <AuthProvider>
            <LoadingScreen />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
