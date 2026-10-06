import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Phlame Nation | Global Music & Entertainment Powerhouse",
  description:
    "Official portal for Phlame Nation Record Label. Discover new music releases, watch official music videos, stream audio, book studio sessions, and explore tour dates.",
  keywords: [
    "Phlame Nation",
    "Music Label",
    "Afrobeats",
    "Music Streaming",
    "Audio Download",
    "Studio Booking",
    "Tour Dates",
  ],
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-[#08080A] text-[#F8F8FA] selection:bg-[#E5A93C] selection:text-[#08080A]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
