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

      {/* ---------- Meet your doctor — full-width story ---------- */}
      <Section className="py-20 md:py-24">
        <div className="max-w-4xl">
          <Eyebrow>Meet your doctor</Eyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Dr. Kalyan Aluri
          </h2>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            Board-certified in Family Medicine and Obesity Medicine. More than
            two decades of experience. Personal experience with everything he
            helps his patients navigate.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {DPC_ABOUT.story.map((paragraph) => (
            <p
              key={paragraph.slice(0, 30)}
              className="text-base leading-7 text-foreground/85"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* ---------- Photo + WIDE credentials below ---------- */}
      <Section className="pb-20 md:pb-24">
        <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-3xl md:aspect-[2.2/1]">
          <Image
            src="/assets/DoctorSmilingatCameraVertical.jpg"
            alt="Dr. Kalyan Aluri"
            fill
            priority={false}
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover object-top"
          />
        </div>

        <div className="mt-10 rounded-3xl border border-border/70 bg-surface p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[minmax(220px,1fr)_1.2fr_1.2fr]">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Credentials
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {PRACTICE.physician.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {PRACTICE.physician.longTitle}
              </p>
            </div>

            <div className="border-t border-border/60 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Education
              </div>
              <ul className="mt-4 space-y-4 text-sm">
                {PRACTICE.physician.education.map((e) => (
                  <li key={e.degree}>
                    <div className="font-medium text-foreground">
                      {e.degree}
                    </div>
                    <div className="text-muted-foreground">{e.school}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/60 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Board certifications
              </div>
              <ul className="mt-4 space-y-3 text-sm text-foreground/90">
                {PRACTICE.physician.boards.map((b) => (
                  <li key={b} className="leading-6">
                    {b}
                  </li>
                ))}
              </ul>
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
