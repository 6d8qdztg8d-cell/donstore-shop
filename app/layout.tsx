import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import CartDrawer from "@/components/shop/CartDrawer";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Donstore – Grip Socks & Performance Gear",
    template: "%s | Donstore",
  },
  description:
    "Donstore Grip Socks – Anti-Rutsch Sportsocken für Fußball, Fitness und Alltag. Grip. Komfort. Kontrolle.",
  openGraph: {
    title: "Donstore – Grip Socks & Performance Gear",
    description: "Premium Anti-Rutsch Sportsocken für jeden Athleten.",
    siteName: "Donstore",
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-[#0a0a0a]">
        <Navbar />
        <CartDrawer />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
