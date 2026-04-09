import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CampaignCallout } from "@/components/marketing/campaign-callout";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { PRACTICE } from "@/lib/site-data";
import { DPC_ABOUT } from "@/lib/dpc-content";
import { CALLOUTS } from "@/lib/campaigns";

export const metadata: Metadata = {
  title: "About Dr. Kalyan Aluri",
  description: DPC_ABOUT.hero.subtitle,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={DPC_ABOUT.hero.eyebrow}
        title={
          <>
            Healthcare that
            <br />
            puts you <span className="text-brand-accent">first.</span>
          </>
        }
        subtitle={DPC_ABOUT.hero.subtitle}
        primaryCta={{ label: "Schedule a Meet & Greet", href: "/contact" }}
      />

      <Section className="py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr]">
          <article className="max-w-prose space-y-6 text-base leading-7 text-foreground/85">
            <Eyebrow>Meet your doctor</Eyebrow>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Dr. Kalyan Aluri
            </h2>
            {DPC_ABOUT.story.map((paragraph) => (
              <p key={paragraph.slice(0, 30)}>{paragraph}</p>
            ))}
          </article>

          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="/assets/DoctorSmilingatCameraVertical.jpg"
                alt="Dr. Kalyan Aluri"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover"
              />
            </div>

            <div className="rounded-3xl border border-border/70 bg-surface p-6">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Credentials
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {PRACTICE.physician.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {PRACTICE.physician.longTitle}
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Education
                  </div>
                  <ul className="mt-2 space-y-2 text-foreground/85">
                    {PRACTICE.physician.education.map((e) => (
                      <li key={e.degree}>
                        <div className="font-medium">{e.degree}</div>
                        <div className="text-xs text-muted-foreground">
                          {e.school}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Board certifications
                  </div>
                  <ul className="mt-2 space-y-1.5 text-foreground/85">
                    {PRACTICE.physician.boards.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-20">
        <CampaignCallout {...CALLOUTS.unhurried} align="center" />
      </Section>

      <Section className="py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/assets/closeupDocwritingonChartVertical.jpg"
              alt="Dr. Aluri writing in a patient chart"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="rounded-3xl bg-brand/5 p-8 md:p-12">
            <Eyebrow>Our mission</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {DPC_ABOUT.mission.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/85">
              {DPC_ABOUT.mission.body}
            </p>

            <dl className="mt-8 space-y-5 border-t border-border/40 pt-6">
              {DPC_ABOUT.values.map((value, i) => (
                <div key={value.title}>
                  <dt className="flex items-baseline gap-3 text-sm font-semibold text-brand">
                    <span className="font-mono text-[11px] text-brand-accent">
                      0{i + 1}
                    </span>
                    {value.title}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {value.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
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
