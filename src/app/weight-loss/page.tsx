import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CampaignCallout } from "@/components/marketing/campaign-callout";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Check } from "lucide-react";
import { DPC_WEIGHT_LOSS } from "@/lib/dpc-content";

const EQUIPMENT = [
  {
    name: "Breezing Pro Breath Analyzer",
    body: "Non-invasive test that measures your resting metabolic rate in minutes — so your nutrition plan is built on real numbers, not guesses.",
    image:
      "/assets/DoctorControllingWeightLossMachineComputerHAndOnlyVertical.jpg",
  },
  {
    name: "Styku 3D Full-Body Scanner",
    body: "Infrared scan creates a full 360° digital body model in under a minute. We use it to track composition changes accurately over time.",
    image:
      "/assets/StykuBodyScannerMachineStandingLowerhalfofBodyWide.jpg",
  },
  {
    name: "EMSzero Pro Body Sculpting",
    body: "High-intensity focused electromagnetic treatment that contracts muscle fibers beyond voluntary effort to tone and define targeted areas.",
    image: "/assets/EMS0ProWeightLossMachineVertical.jpg",
  },
  {
    name: "40K / 80K Ultrasonic Cavitation",
    body: "Focused ultrasound that breaks down stubborn fat cells in specific regions without incisions or downtime.",
    image: "/assets/DocusingWeightLossWandNoFaceVertical.jpg",
  },
];

export const metadata: Metadata = {
  title: "Weight Loss & Aesthetics",
  description: DPC_WEIGHT_LOSS.hero.subtitle,
};

export default function WeightLossPage() {
  return (
    <>
      <PageHeader
        eyebrow="Indiana Weight Loss & Aesthetics"
        title={
          <>
            Weight management,
            <br />
            done <span className="text-brand-accent">right.</span>
          </>
        }
        subtitle={DPC_WEIGHT_LOSS.hero.subtitle}
        primaryCta={{ label: "Book a Consultation", href: "/contact" }}
      />

      {/* Programs */}
      <Section className="py-16 md:py-20">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Programs</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Two proven paths. Real medical oversight.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {DPC_WEIGHT_LOSS.programs.map((program) => (
            <article
              key={program.name}
              className="flex flex-col rounded-3xl border border-border/70 bg-surface p-8"
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {program.name}
              </h3>
              <p className="mt-1 text-sm italic text-brand-accent">
                {program.subtitle}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {program.body}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-border/60 pt-5 text-sm">
                {program.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-foreground/85">{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section className="py-20 md:py-24">
        <CampaignCallout
          primary="Lose the weight."
          accent="Keep it off."
          body="This isn't a shake or an app. It's a real medical evaluation, a real plan built around your life, and a physician who walked it himself."
          align="center"
        />
      </Section>

      {/* Equipment */}
      <Section className="py-16">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Equipment</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Modern tools. Real measurement.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We use clinical-grade equipment so your plan is built on real
            data — not guesses.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {EQUIPMENT.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-3xl border border-border/70 bg-surface"
            >
              <div className="relative aspect-[16/10] bg-brand/5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {item.name}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Included */}
      <Section className="py-20">
        <div className="rounded-3xl border border-border/70 bg-surface p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {DPC_WEIGHT_LOSS.whatsIncluded.title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every weight-loss program, regardless of which path you
                choose, starts with the same foundation.
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              {DPC_WEIGHT_LOSS.whatsIncluded.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Consultation pricing */}
      <Section className="py-16">
        <div className="mb-10">
          <Eyebrow>Consultations</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Two ways to start.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            DPC_WEIGHT_LOSS.consultation.inPerson,
            DPC_WEIGHT_LOSS.consultation.virtual,
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-baseline justify-between rounded-2xl border border-border/70 bg-surface p-6"
            >
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-brand">
                  ${c.price}
                </div>
              </div>
              <Link
                href="/contact"
                className="text-sm font-medium text-brand-accent hover:underline"
              >
                Book →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-20 md:py-24">
        <CtaBanner
          title="Let&rsquo;s build your plan."
          body="A 45-minute consultation with Dr. Aluri is all it takes to get started."
          primaryCta={{ label: "Book a Consultation", href: "/contact" }}
        />
      </Section>
    </>
  );
}
