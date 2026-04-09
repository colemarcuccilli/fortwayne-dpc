import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Section, Eyebrow } from "@/components/marketing/section";
import { LinkButton } from "@/components/ui/link-button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DPC_MEMBERSHIP } from "@/lib/dpc-content";

export const metadata: Metadata = {
  title: "Membership & Pricing",
  description:
    "Direct primary care membership pricing for individuals, families, and students. One flat monthly fee, no insurance.",
};

export default function DpcMembershipPage() {
  return (
    <>
      <Hero
        eyebrow={DPC_MEMBERSHIP.hero.eyebrow}
        title={DPC_MEMBERSHIP.hero.title}
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
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
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
