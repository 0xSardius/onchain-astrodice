import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CosmicBackground } from "@/components/layout/cosmic-background";
import { Header } from "@/components/layout/header";
import { Nav } from "@/components/layout/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onchain Astrodice",
  description:
    "Divine your path with the stars. Roll the cosmic dice, get AI-powered readings, and mint your destiny as an NFT on Base.",
  openGraph: {
    title: "Onchain Astrodice",
    description: "Divine your path with the stars",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a1a] text-white min-h-screen`}
      >
        <Providers>
          <CosmicBackground />
          <Header />
          <main className="pt-16 pb-20 min-h-screen">{children}</main>
          <Nav />
        </Providers>
      </body>
    </html>
  );
}
