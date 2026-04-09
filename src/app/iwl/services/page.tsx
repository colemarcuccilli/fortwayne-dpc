import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { IWL_SERVICES } from "@/lib/iwl-content";

export const metadata: Metadata = {
  title: "Services",
  description: IWL_SERVICES.hero.subtitle,
};

export default function IwlServicesPage() {
  return (
    <>
      <Hero
        eyebrow={IWL_SERVICES.hero.eyebrow}
        title={IWL_SERVICES.hero.title}
        subtitle={IWL_SERVICES.hero.subtitle}
        primaryCta={{ label: "Book a Consultation", href: "/contact" }}
      />

      <Section className="space-y-20 py-16 md:py-20">
        {IWL_SERVICES.sections.map((section) => (
          <div key={section.heading}>
            <Eyebrow>{section.heading}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {section.heading}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border/70 bg-surface p-6"
                >
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section className="py-20 md:py-24">
        <CtaBanner
          title="Which program fits you?"
          body="Book a 45-minute consultation and we'll figure out exactly where to start — together."
          primaryCta={{ label: "Book a Consultation", href: "/contact" }}
        />
      </Section>
    </>
  );
}
