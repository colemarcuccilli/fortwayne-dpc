import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { PRACTICE } from "@/lib/site-data";
import { IWL_ABOUT } from "@/lib/iwl-content";

export const metadata: Metadata = {
  title: "About",
  description: IWL_ABOUT.hero.subtitle,
};

export default function IwlAboutPage() {
  return (
    <>
      <Hero
        eyebrow={IWL_ABOUT.hero.eyebrow}
        title={IWL_ABOUT.hero.title}
        subtitle={IWL_ABOUT.hero.subtitle}
        primaryCta={{ label: "Book a Consultation", href: "/contact" }}
      />

      <Section className="py-20 md:py-24">
        <div className="grid gap-16 md:grid-cols-[1.5fr_1fr]">
          <article className="max-w-prose space-y-6 text-base leading-7 text-foreground/85">
            <Eyebrow>The story</Eyebrow>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Lived experience, backed by medicine.
            </h2>
            {IWL_ABOUT.story.map((paragraph) => (
              <p key={paragraph.slice(0, 30)}>{paragraph}</p>
            ))}
          </article>

          <aside className="h-fit rounded-3xl border border-border/70 bg-surface p-8">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Your physician
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
              {PRACTICE.physician.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {PRACTICE.physician.longTitle}
            </p>

            <div className="mt-6 space-y-5 text-sm">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Board Certifications
                </div>
                <ul className="mt-2 space-y-1.5 text-foreground/85">
                  {PRACTICE.physician.boards.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Also trained in
                </div>
                <ul className="mt-2 space-y-1.5 text-foreground/85">
                  <li>Functional medicine</li>
                  <li>Lifestyle medicine</li>
                  <li>Human nutrition (MS)</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="py-20 md:py-24">
        <CtaBanner
          title="Ready to start?"
          primaryCta={{ label: "Book a Consultation", href: "/contact" }}
          secondaryCta={{ label: "See Services", href: "/services" }}
        />
      </Section>
    </>
  );
}
