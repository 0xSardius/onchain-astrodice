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

// Farcaster Mini App embed configuration
const fcEmbed = {
  version: "1",
  imageUrl: "https://onchain-astrodice.vercel.app/astrodice-logo.png",
  button: {
    title: "Cast the Dice",
    action: {
      type: "launch_miniapp",
      name: "Onchain Astrodice",
      url: "https://onchain-astrodice.vercel.app",
      splashImageUrl: "https://onchain-astrodice.vercel.app/astrodice-logo.png",
      splashBackgroundColor: "#0a0a1a",
    },
  },
};

export const metadata: Metadata = {
  title: "Onchain Astrodice",
  description:
    "Divine your path with the stars. Roll the cosmic dice, get AI-powered readings, and mint your destiny as an NFT on Base.",
  openGraph: {
    title: "Onchain Astrodice",
    description: "Divine your path with the stars",
    type: "website",
    images: [
      {
        url: "https://onchain-astrodice.vercel.app/astrodice-logo.png",
        width: 1200,
        height: 630,
        alt: "Onchain Astrodice - Divine your path with the stars",
      },
    ],
  },
  other: {
    "fc:miniapp": JSON.stringify(fcEmbed),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a1a",
  viewportFit: "cover",
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
