// Central brand registry. Each brand maps a hostname to a route prefix and
// theming. The proxy at src/proxy.ts rewrites incoming requests based on
// hostname, so every brand renders from the same Next app.

export type BrandId = "dpc" | "iwl";

export interface BrandConfig {
  id: BrandId;
  /** URL prefix used internally (e.g. /dpc or /iwl) */
  prefix: string;
  /** Production hostnames that map to this brand */
  hostnames: string[];
  /** Canonical production URL for metadata */
  canonicalUrl: string;
  /** Display name */
  name: string;
  /** Short name for the nav wordmark */
  short: string;
  /** Tagline used as OG description fallback */
  tagline: string;
  /** Theme token — matches a `data-brand="..."` block in globals.css */
  theme: BrandId;
}

export const BRANDS: Record<BrandId, BrandConfig> = {
  dpc: {
    id: "dpc",
    prefix: "/dpc",
    hostnames: [
      "fortwaynedpc.com",
      "www.fortwaynedpc.com",
      "fortwayne-dpc.vercel.app",
    ],
    canonicalUrl: "https://fortwaynedpc.com",
    name: "Fort Wayne Direct Primary Care",
    short: "Fort Wayne DPC",
    tagline:
      "Personalized primary care in Fort Wayne — no copays, no waiting rooms, direct access to your physician.",
    theme: "dpc",
  },
  iwl: {
    id: "iwl",
    prefix: "/iwl",
    hostnames: [
      "indianaloseweight.com",
      "www.indianaloseweight.com",
    ],
    canonicalUrl: "https://indianaloseweight.com",
    name: "Indiana Weight Loss & Aesthetics",
    short: "Indiana Weight Loss",
    tagline:
      "Physician-led weight loss and metabolic care in Fort Wayne, Indiana.",
    theme: "iwl",
  },
};

/** Resolve a brand from an incoming Host header. Returns null if no match. */
export function resolveBrandFromHost(host: string | null): BrandConfig | null {
  if (!host) return null;
  const normalized = host.toLowerCase().split(":")[0];
  for (const brand of Object.values(BRANDS)) {
    if (brand.hostnames.includes(normalized)) return brand;
  }
  return null;
}

export const DEFAULT_BRAND = BRANDS.dpc;
