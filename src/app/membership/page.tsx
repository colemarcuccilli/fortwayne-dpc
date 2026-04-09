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

            {/* Eye check PNG — transparent cutout beside the wellness callout */}
            <div className="mt-8 flex items-center gap-5 rounded-2xl border border-border/70 bg-surface p-5">
              <div className="relative h-24 w-24 shrink-0">
                <Image
                  src="/assets/DoctorEyeCheckNoBakgroundPNG.png"
                  alt="Dr. Aluri performing a vision check"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
                  Wellness exams
                </div>
                <p className="mt-1 text-sm leading-6 text-foreground/85">
                  Every annual check includes a full physical, vision
                  check, and a conversation about what&rsquo;s actually on
                  your mind — not a rushed 15-minute slot.
                </p>
              </div>
            </div>
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
