import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Section, Eyebrow } from "@/components/marketing/section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { PRACTICE } from "@/lib/site-data";
import { DPC_ABOUT } from "@/lib/dpc-content";

export const metadata: Metadata = {
  title: "About Dr. Kalyan Aluri",
  description: DPC_ABOUT.hero.subtitle,
};

export default function DpcAboutPage() {
  return (
    <>
      <Hero
        eyebrow={DPC_ABOUT.hero.eyebrow}
        title={DPC_ABOUT.hero.title}
        subtitle={DPC_ABOUT.hero.subtitle}
        primaryCta={{ label: "Schedule a Meet & Greet", href: "/contact" }}
      />

      <Section className="py-20 md:py-24">
        <div className="grid gap-16 md:grid-cols-[1.5fr_1fr]">
          <article className="prose-neutral max-w-prose space-y-6 text-base leading-7 text-foreground/85">
            <Eyebrow>Meet your doctor</Eyebrow>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Dr. Kalyan Aluri
            </h2>
            {DPC_ABOUT.story.map((paragraph) => (
              <p key={paragraph.slice(0, 30)}>{paragraph}</p>
            ))}
          </article>

          <aside className="h-fit rounded-3xl border border-border/70 bg-surface p-8">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Credentials
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
                  Education
                </div>
                <ul className="mt-2 space-y-2 text-foreground/85">
                  {PRACTICE.physician.education.map((e) => (
                    <li key={e.degree}>
                      <div className="font-medium">{e.degree}</div>
                      <div className="text-muted-foreground">{e.school}</div>
                    </li>
                  ))}
                </ul>
              </div>

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
            </div>
          </aside>
        </div>
      </Section>

      <Section className="py-20">
        <div className="rounded-3xl bg-brand/5 p-10 md:p-14">
          <div className="max-w-xl">
            <Eyebrow>Our mission</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {DPC_ABOUT.mission.title}
            </h2>
            <p className="mt-4 text-lg leading-7 text-foreground/85">
              {DPC_ABOUT.mission.body}
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-24">
        <div className="mb-12 max-w-xl">
          <Eyebrow>What we value</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three things we&rsquo;re not willing to compromise on.
          </h2>
        </div>
        <FeatureGrid features={DPC_ABOUT.values} columns={3} />
      </Section>

      <Section className="py-20 md:py-24">
        <CtaBanner
          title="Ready to see what care like this actually feels like?"
          primaryCta={{ label: "Schedule a Meet & Greet", href: "/contact" }}
          secondaryCta={{ label: "See Membership", href: "/membership" }}
        />
      </Section>
    </>
  );
}
