import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CampaignCallout } from "@/components/marketing/campaign-callout";
import { LinkButton } from "@/components/ui/link-button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DPC_MEMBERSHIP } from "@/lib/dpc-content";
import { CALLOUTS } from "@/lib/campaigns";

export const metadata: Metadata = {
  title: "Membership & Pricing",
  description:
    "Direct primary care membership pricing for individuals, families, and students. One flat monthly fee, no insurance.",
};

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow={DPC_MEMBERSHIP.hero.eyebrow}
        title={
          <>
            Membership <span className="text-brand-accent">pricing.</span>
          </>
        }
        subtitle={DPC_MEMBERSHIP.hero.subtitle}
        primaryCta={{ label: "Schedule a Meet & Greet", href: "/contact" }}
      />

      <Section className="py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {DPC_MEMBERSHIP.tiers.map((tier) => (
            <article
              key={tier.id}
              className={cn(
                "flex h-full flex-col rounded-3xl border bg-surface p-8 transition-colors",
                tier.featured
                  ? "border-brand/50 shadow-md ring-1 ring-brand/20"
                  : "border-border/70",
              )}
            >
              <header>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <span className="rounded-full bg-brand-accent/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </header>

              <div className="mt-6 space-y-2.5 border-y border-border/60 py-6">
                {tier.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="text-foreground/85">
                      {row.label}
                      {row.note && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({row.note})
                        </span>
                      )}
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-foreground">
                      {row.price}
                    </span>
                  </div>
                ))}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {tier.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                    <span className="text-foreground/85">{inc}</span>
                  </li>
                ))}
              </ul>

              <LinkButton
                href="/contact"
                variant={tier.featured ? "brand" : "outline"}
                size="md"
                className="mt-8 w-full"
              >
                Start with {tier.name}
              </LinkButton>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {DPC_MEMBERSHIP.enrollment.note}
        </p>
      </Section>

      <Section className="py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/assets/MAlePatientonPatientBedSittingUpVertical.jpg"
              alt="A patient sitting up on an exam-room bed at Fort Wayne Direct Primary Care"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <Eyebrow>In-office care</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Most of what you need, under one roof.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Point-of-care testing, simple in-office procedures, and the
              time to actually sit and talk through what&rsquo;s going on.
              You&rsquo;ll rarely feel shuffled through — because you
              aren&rsquo;t.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- Dedicated Wellness Exam section ----------
           Uses the doctor-with-patient PNG. Because the PNG is a
           background-less cutout with a hard edge at waist level, we
           place a solid dark-navy "floor" stripe at the bottom of the
           panel that covers the crop line. */}
      <Section className="py-16 md:py-20">
        <div className="relative grid items-stretch gap-0 overflow-hidden rounded-3xl bg-brand-muted md:grid-cols-[1fr_1.15fr]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-accent/25 blur-3xl"
          />

          {/* Left: PNG with a brand-dark floor stripe hiding the crop */}
          <div className="relative h-80 md:h-[560px]">
            <Image
              src="/assets/DoctorwithPatientNoBackground.png"
              alt="Dr. Kalyan Aluri with a patient at Fort Wayne Direct Primary Care"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(10,37,64,0.18)]"
            />
            {/* Floor stripe — covers the cutout's hard crop line */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 flex h-20 items-center justify-between bg-brand-dark px-6 text-brand-foreground md:h-24 md:px-10"
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-foreground/70">
                Fort Wayne DPC
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Wellness visit
              </span>
            </div>
          </div>

          {/* Right: copy */}
          <div className="relative p-8 md:p-14">
            <Eyebrow>Wellness exams</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Annual checks that
              <br />
              actually <span className="text-brand-accent">check.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-foreground/85">
              The 15-minute well visit is a myth we don&rsquo;t perpetuate.
              Your annual exam is unhurried and covers what actually
              matters.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Full head-to-toe physical",
                "Vision and hearing screen",
                "Cardiovascular and metabolic check-in",
                "Skin screen for concerning lesions",
                "Mental health check-in — not an afterthought",
                "Personalized preventative plan for the year ahead",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-24">
        <CampaignCallout {...CALLOUTS.noCopays} align="center" />
      </Section>

      <Section className="py-16">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>À la carte services</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {DPC_MEMBERSHIP.services.title}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {DPC_MEMBERSHIP.services.note}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
          <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-border/60 bg-surface-muted px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span>Service</span>
            <span className="text-right">Member</span>
            <span className="text-right">Non-member</span>
          </div>
          {DPC_MEMBERSHIP.services.rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-border/40 px-6 py-4 text-sm last:border-b-0"
            >
              <span className="text-foreground/90">{row.label}</span>
              <span className="text-right font-mono tabular-nums text-foreground">
                {row.member}
              </span>
              <span className="text-right font-mono tabular-nums text-muted-foreground">
                {row.nonMember}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
