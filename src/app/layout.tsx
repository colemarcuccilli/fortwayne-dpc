import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/brand/header";
import { Footer } from "@/components/brand/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fort Wayne Direct Primary Care — Personalized care, no insurance",
    template: "%s | Fort Wayne Direct Primary Care",
  },
  description:
    "Personalized primary care in Fort Wayne, Indiana. Direct access to your physician for a flat monthly fee — no copays, no waiting rooms, unlimited visits.",
  metadataBase: new URL("https://fortwaynedpc.com"),
  openGraph: {
    title: "Fort Wayne Direct Primary Care",
    description:
      "Personalized primary care in Fort Wayne, Indiana. One flat monthly fee — no copays, no waiting rooms.",
    url: "https://fortwaynedpc.com",
    siteName: "Fort Wayne Direct Primary Care",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
