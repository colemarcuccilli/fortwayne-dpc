import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Section } from "@/components/marketing/section";
import { ContactForm } from "@/components/marketing/contact-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PRACTICE } from "@/lib/site-data";
import { DPC_CONTACT } from "@/lib/dpc-content";

export const metadata: Metadata = {
  title: "Contact",
  description: DPC_CONTACT.hero.subtitle,
};

export default function DpcContactPage() {
  return (
    <>
      <Hero
        eyebrow={DPC_CONTACT.hero.eyebrow}
        title={DPC_CONTACT.hero.title}
        subtitle={DPC_CONTACT.hero.subtitle}
      />

      <Section className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <ContactForm heardAboutOptions={DPC_CONTACT.heardAboutOptions} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border/70 bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Contact info
              </h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div>
                    <a
                      href={PRACTICE.phoneHref}
                      className="font-mono text-foreground transition-colors hover:text-brand"
                    >
                      {PRACTICE.phone}
                    </a>
                    <div className="text-xs text-muted-foreground">
                      Fax: {PRACTICE.fax}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <a
                    href={PRACTICE.emailHref}
                    className="text-foreground transition-colors hover:text-brand"
                  >
                    {PRACTICE.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <address className="not-italic text-foreground/90">
                    {PRACTICE.address.street}
                    <br />
                    {PRACTICE.address.city}, {PRACTICE.address.state}{" "}
                    {PRACTICE.address.zip}
                  </address>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-surface p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Clock className="h-4 w-4" /> Office hours
              </h3>
              <div className="mt-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  Primary care
                </div>
                <ul className="mt-2 space-y-1.5 font-mono text-xs">
                  {PRACTICE.hours.primaryCare.map((h) => (
                    <li key={h.day} className="flex justify-between">
                      <span className="text-foreground/85">{h.day}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {h.open} – {h.close}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 border-t border-border/60 pt-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  Urgent care
                </div>
                <ul className="mt-2 space-y-1.5 font-mono text-xs">
                  {PRACTICE.hours.urgentCare.map((h) => (
                    <li key={h.day} className="flex justify-between">
                      <span className="text-foreground/85">{h.day}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {h.open} – {h.close}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
