import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { PRACTICE } from "@/lib/site-data";

const NAV = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Weight Loss & Aesthetics", href: "/weight-loss" },
  { label: "Patient Form", href: "/patient-form" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface-muted/60">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="max-w-sm space-y-5">
          <Logo height={48} />
          <p className="text-sm leading-6 text-muted-foreground">
            Personalized primary care for individuals and families in Fort
            Wayne, Indiana. Direct access to your physician for one flat
            monthly fee.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
            Site
          </h4>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
            Contact
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={PRACTICE.phoneHref}
                className="font-mono text-foreground/80 transition-colors hover:text-brand"
              >
                {PRACTICE.phone}
              </a>
            </li>
            <li>
              <a
                href={PRACTICE.emailHref}
                className="text-foreground/80 transition-colors hover:text-brand"
              >
                {PRACTICE.email}
              </a>
            </li>
            <li className="pt-1 text-foreground/80">
              {PRACTICE.address.street}
              <br />
              {PRACTICE.address.city}, {PRACTICE.address.state}{" "}
              {PRACTICE.address.zip}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
            Hours
          </h4>
          <ul className="mt-4 space-y-1.5 font-mono text-xs text-foreground/80">
            {PRACTICE.hours.primaryCare.map((h) => (
              <li key={h.day} className="flex justify-between gap-3">
                <span>{h.day.slice(0, 3)}</span>
                <span className="tabular-nums">
                  {h.open.replace(":00", "")} – {h.close.replace(":00", "")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fort Wayne Direct Primary Care. All
            rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Medical information on this site is educational and is not a
            substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
