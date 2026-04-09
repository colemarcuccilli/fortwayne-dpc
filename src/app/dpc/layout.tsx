import type { Metadata } from "next";
import { Header } from "@/components/brand/header";
import { Footer } from "@/components/brand/footer";
import { BRANDS } from "@/lib/brands";

const brand = BRANDS.dpc;

const nav = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Contact", href: "/contact" },
];

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s | ${brand.short}`,
  },
  description: brand.tagline,
  openGraph: {
    title: brand.name,
    description: brand.tagline,
    url: brand.canonicalUrl,
    siteName: brand.name,
    type: "website",
  },
};

export default function DpcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand="dpc" className="flex min-h-screen flex-col bg-background">
      <Header
        brand="dpc"
        nav={nav}
        ctaLabel="Become a Member"
        ctaHref="/membership"
      />
      <main className="flex-1">{children}</main>
      <Footer brand="dpc" nav={nav} tagline={brand.tagline} />
    </div>
  );
}
