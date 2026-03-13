import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Thuong's Portfolio",
  description: "Nguyen Hoai Thuong - AI Engineer Portfolio. Open to new career opportunities in Ho Chi Minh City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased bg-[#232323]`}>
        {children}
      </body>
    </html>
  );
}
