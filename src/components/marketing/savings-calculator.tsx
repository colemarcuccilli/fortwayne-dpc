"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Info, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveSubmissionLocal } from "@/lib/admin/public-submission";
import {
  EMPLOYER_ECONOMICS,
  PLAN_TYPE_OPTIONS,
  type EmployerPlanType,
} from "@/lib/employer-content";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/**
 * The "Personal Opportunity" savings model — the killer lead asset.
 * Inputs on the left, live transparent output on the right. Submitting
 * the contact block sends an employer inquiry (with the modeled numbers)
 * into the admin inbox / pipeline.
 *
 * The math is deliberately conservative and its assumptions are shown
 * openly so a skeptical CFO can trust it.
 */
export function SavingsCalculator() {
  const [employees, setEmployees] = useState("50");
  const [planType, setPlanType] = useState<EmployerPlanType>("self_funded");
  const [spendPerEmployee, setSpendPerEmployee] = useState(
    String(EMPLOYER_ECONOMICS.defaultSpendPerEmployee),
  );

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const model = useMemo(() => {
    const n = Math.max(0, Number(employees) || 0);
    const perEmp = Math.max(0, Number(spendPerEmployee) || 0);
    const pepm = EMPLOYER_ECONOMICS.pepm;
    const rate = EMPLOYER_ECONOMICS.reduction[planType];

    const currentTotal = n * perEmp;
    const dpcCost = n * pepm * 12;
    const netSavings = currentTotal * rate; // already net of the DPC fee
    const roi = dpcCost > 0 ? netSavings / dpcCost : 0;

    return { n, perEmp, pepm, rate, currentTotal, dpcCost, netSavings, roi };
  }, [employees, planType, spendPerEmployee]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveSubmissionLocal({
      type: "employer",
      name: name.trim() || company.trim() || "Employer inquiry",
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      subject: `Savings estimate — ${company.trim() || "company"} (${model.n} employees)`,
      message: `Requested a custom savings estimate.`,
      meta: {
        company: company.trim(),
        employees: model.n,
        planType,
        currentSpendPerEmployee: model.perEmp,
        modeledCurrentTotal: model.currentTotal,
        modeledDpcCost: model.dpcCost,
        modeledNetSavings: Math.round(model.netSavings),
        modeledRoi: `${Math.round(model.roi * 100)}%`,
      },
    });
    setSubmitted(true);
  }

  const rangeLabel = EMPLOYER_ECONOMICS.reductionRangeLabel[planType];

  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-surface">
      <div className="grid lg:grid-cols-2">
        {/* ---------- Inputs ---------- */}
        <div className="border-b border-border/60 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Your company
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Estimate your opportunity
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Three numbers. The estimate updates as you type.
          </p>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="calc-employees">Number of employees</Label>
              <Input
                id="calc-employees"
                type="number"
                min={1}
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>How do you fund healthcare today?</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLAN_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPlanType(opt.value)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      planType === opt.value
                        ? "border-brand bg-brand/5 font-medium text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-brand/40",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {PLAN_TYPE_OPTIONS.find((o) => o.value === planType)?.hint}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calc-spend">
                Current healthcare cost per employee / year
              </Label>
              <Input
                id="calc-spend"
                type="number"
                min={0}
                step={500}
                value={spendPerEmployee}
                onChange={(e) => setSpendPerEmployee(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Not sure? Employer cost commonly runs $8,000–$12,000 per
                employee. Adjust to your real number for a better estimate.
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Output ---------- */}
        <div className="bg-brand-muted/40 p-6 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Your estimated opportunity
          </div>

          <div className="mt-4 rounded-2xl bg-brand p-5 text-brand-foreground">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand-foreground/70">
              Projected net annual savings
            </div>
            <div className="mt-1 font-mono text-4xl font-bold tabular-nums">
              {money(model.netSavings)}
            </div>
            <div className="mt-1 text-xs text-brand-foreground/80">
              Modeled at a conservative {Math.round(model.rate * 100)}% total-cost
              reduction ({rangeLabel} typical for this plan type).
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <Row
              label="Your current healthcare spend"
              value={money(model.currentTotal)}
            />
            <Row
              label={`DPC cost (${model.n} × $${model.pepm}/mo)`}
              value={money(model.dpcCost)}
              sub="transparent, no hidden fees"
            />
            <div className="border-t border-border/60 pt-3">
              <Row
                label="Return on the DPC investment"
                value={`${Math.round(model.roi * 100)}%`}
                strong
              />
            </div>
          </dl>

          {/* Better-benefit column */}
          <div className="mt-5 rounded-xl border border-border/60 bg-surface p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
              And your team gets
            </div>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {[
                "Unlimited visits, no copays",
                "Same-day access",
                "A real doctor by text",
                "Labs & meds at cost",
              ].map((b) => (
                <li key={b} className="flex items-center gap-1.5 text-xs text-foreground/85">
                  <Check className="h-3 w-3 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-5 text-muted-foreground">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            Estimate only, shown with its assumptions. Savings come from
            pairing DPC with a suitable plan design; your real result depends
            on your plan and utilization. We&rsquo;ll model it against your
            actual data on the call.
          </p>
        </div>
      </div>

      {/* ---------- Lead capture ---------- */}
      <div className="border-t border-border/60 bg-surface p-6 sm:p-8">
        {submitted ? (
          <div className="flex items-start gap-3 rounded-2xl bg-brand/5 p-5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Got it — we&rsquo;ll send your one-page estimate.
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                We&rsquo;ll follow up within one business day to confirm your
                numbers and book a 15-minute consult.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Get this as a one-page report
              </h3>
              <p className="text-sm text-muted-foreground">
                We&rsquo;ll tailor it to your real numbers and send it over —
                no obligation.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="calc-name">Your name</Label>
                <Input
                  id="calc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-company">Company</Label>
                <Input
                  id="calc-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-email">Email</Label>
                <Input
                  id="calc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-phone">Phone</Label>
                <Input
                  id="calc-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Send className="mr-1.5 h-4 w-4" />
              Send me my savings estimate
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  strong,
}: {
  label: string;
  value: string;
  sub?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn("text-muted-foreground", strong && "font-semibold text-foreground")}>
        {label}
        {sub && <span className="block text-[11px] text-muted-foreground/80">{sub}</span>}
      </dt>
      <dd
        className={cn(
          "shrink-0 font-mono tabular-nums text-foreground",
          strong ? "text-lg font-bold text-brand" : "font-semibold",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
