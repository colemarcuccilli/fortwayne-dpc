import type { Metadata } from "next";
import { Header } from "@/components/brand/header";
import { Footer } from "@/components/brand/footer";
import { BRANDS } from "@/lib/brands";

const brand = BRANDS.iwl;

const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
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

export default function IwlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand="iwl" className="flex min-h-screen flex-col bg-background">
      <Header
        brand="iwl"
        nav={nav}
        ctaLabel="Book a Consultation"
        ctaHref="/contact"
      />
      <main className="flex-1">{children}</main>
      <Footer brand="iwl" nav={nav} tagline={brand.tagline} />
    </div>
  );
}
