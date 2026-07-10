import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Target,
  Search,
  Building2,
  Users,
  AlertTriangle,
  ListChecks,
  Ban,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Research instructions",
};

export default function ResearchInstructionsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      <Link
        href="/research"
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to console
      </Link>

      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Research agent instructions
        </h1>
        <p className="mt-2 text-slate-600">
          You are researching businesses that could offer Fort Wayne Direct
          Primary Care (DPC) as a healthcare benefit to their employees. Your
          job is to find good-fit companies, gather the facts below, and enter
          one company per submission on the{" "}
          <Link
            href="/research"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            Add a prospect
          </Link>{" "}
          console. Everything you save lands in the <em>Researched</em> column
          of the sales pipeline for the team to work.
        </p>
      </header>

      {/* The offer */}
      <Section icon={Target} title="What we're selling (context)">
        <p>
          Fort Wayne DPC offers employers a flat, per-employee-per-month (PEPM)
          membership that gives their staff unlimited primary care — same/next-
          day visits, direct text/call/video access to the doctor, in-office
          testing, and wholesale medications — with <strong>no copays and no
          insurance billing</strong>. Employers pair it with a
          high-deductible plan to cut total healthcare spend. Dr. Aluri is also
          board-certified in <strong>obesity medicine</strong>, so GLP-1 /
          weight-management is a differentiator most DPCs can&rsquo;t match.
        </p>
        <p className="mt-3">
          That means the best prospects are employers who <strong>pay for
          their own healthcare</strong> and have enough employees to make a
          contract worthwhile — but not so many that a solo practice
          can&rsquo;t serve them.
        </p>
      </Section>

      {/* Ideal profile */}
      <Section icon={CheckCircle2} title="Ideal prospect profile">
        <ul className="space-y-2">
          <Bullet>
            <strong>Location:</strong> Fort Wayne / Allen County, IN and the
            immediate surrounding communities (New Haven, Huntertown, Roanoke,
            Auburn, Columbia City). Local is a hard requirement — employees need
            to be able to drive to the office.
          </Bullet>
          <Bullet>
            <strong>Size:</strong> 25–250 employees is the sweet spot. 10–25 can
            work. Flag anything over 250 as a &ldquo;long-shot&rdquo; (bigger
            wins but harder for a solo practice).
          </Bullet>
          <Bullet>
            <strong>Self-funded / level-funded health plan:</strong> the single
            biggest signal. These employers pay claims directly, so DPC saves
            them real money. Fully-insured small groups are much weaker — note
            it if you can find it, but don&rsquo;t skip a great local prospect
            just because you can&rsquo;t confirm funding.
          </Bullet>
          <Bullet>
            <strong>Industry:</strong> manufacturing, logistics/trucking, skilled
            trades (HVAC, plumbing, electrical, construction), warehousing, and
            professional-services firms. Physically demanding or higher-turnover
            workforces get the most value.
          </Bullet>
          <Bullet>
            <strong>Ownership:</strong> privately held / family-owned decide
            faster than public companies or national chains.
          </Bullet>
        </ul>
      </Section>

      {/* What to find */}
      <Section icon={Search} title="What to find about each company">
        <p className="mb-3 text-sm">
          Fill as many fields as you can. Missing a field is fine — never
          invent data. If you can&rsquo;t confirm something, leave it blank and
          note the uncertainty in the research notes.
        </p>

        <SubHeading icon={Building2}>Company basics</SubHeading>
        <ul className="space-y-1.5">
          <Bullet>Legal / common business name</Bullet>
          <Bullet>Website URL</Bullet>
          <Bullet>Industry (be specific: &ldquo;CNC machining&rdquo; beats &ldquo;manufacturing&rdquo;)</Bullet>
          <Bullet>Approximate employee count (and how you know — LinkedIn, news, etc.)</Bullet>
          <Bullet>Primary location / address in the Fort Wayne area</Bullet>
          <Bullet>Ownership type (private, family-owned, franchise, public)</Bullet>
        </ul>

        <SubHeading icon={CheckCircle2}>Fit signals</SubHeading>
        <ul className="space-y-1.5">
          <Bullet>Self-funded / level-funded plan (check job postings, benefits pages, news, or note &ldquo;unknown&rdquo;)</Bullet>
          <Bullet>Is the employee count in the 25–250 sweet spot?</Bullet>
          <Bullet>Physically demanding or high-turnover workforce?</Bullet>
          <Bullet>Growth signals — hiring sprees, new location, new shift, expansion news</Bullet>
          <Bullet>Any public complaints about healthcare cost / benefits</Bullet>
        </ul>

        <SubHeading icon={Users}>Decision-makers</SubHeading>
        <p className="text-sm">
          For each person, capture name, title, email, phone, and LinkedIn if
          available. Prioritize (in order):
        </p>
        <ul className="mt-1.5 space-y-1.5">
          <Bullet>Owner / President / CEO (small companies — the owner decides)</Bullet>
          <Bullet>CFO / Controller (they own the healthcare-cost math)</Bullet>
          <Bullet>HR Director / Benefits Manager / Office Manager</Bullet>
        </ul>

        <SubHeading icon={ListChecks}>Extra intel (research notes)</SubHeading>
        <ul className="space-y-1.5">
          <Bullet>Current benefits broker, if findable</Bullet>
          <Bullet>Benefits renewal timing (often Jan 1 — pitches land best 3–6 months before)</Bullet>
          <Bullet>Warm-intro paths — shared Chamber / Rotary membership, mutual vendors, alumni</Bullet>
          <Bullet>Trigger events — recent healthcare-cost news, layoffs, growth, ownership change</Bullet>
          <Bullet>General contact phone / address / info email</Bullet>
        </ul>
      </Section>

      {/* How to score */}
      <Section icon={Target} title="How to score fit (1–10)">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <ScoreRow range="9–10" label="Local, self-funded, 25–250 employees, physical workforce, a named warm contact." />
              <ScoreRow range="7–8" label="Local, right size, good industry — but funding model unconfirmed or no direct contact yet." />
              <ScoreRow range="5–6" label="Local and plausible, but wrong size, fully-insured, or weak industry fit." />
              <ScoreRow range="1–4" label="Long-shot — too big, out of area, or unlikely to buy. Log it, but be honest." />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          Always write one honest paragraph in the <strong>fit reason</strong>{" "}
          field explaining the score. That paragraph is what the team reads
          first.
        </p>
      </Section>

      {/* Estimating value */}
      <Section icon={Building2} title="Estimating annual value">
        <p>
          A rough estimate helps prioritize. Use roughly{" "}
          <strong>employee count × $79 × 12</strong> as a ballpark PEPM value
          (assume ~75% of employees enroll if you want to be conservative). For
          example, a 60-employee company ≈ 45 enrolled × $79 × 12 ≈{" "}
          <strong>$42,000/yr</strong>. It&rsquo;s an estimate, not a quote —
          when unsure, leave it blank.
        </p>
      </Section>

      {/* How to enter */}
      <Section icon={ListChecks} title="How to enter each prospect">
        <ol className="ml-4 list-decimal space-y-2">
          <li>Open the <Link href="/research" className="font-medium underline underline-offset-2">Add a prospect</Link> console.</li>
          <li>Fill Section 1 (Company), 2 (Fit), 3 (Decision-makers), 4 (Notes, tags, sources).</li>
          <li>
            Add <strong>tags</strong> so the team can filter — e.g.{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">self-funded</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">manufacturer</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">warm-intro</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">long-shot</code>.
          </li>
          <li>
            Paste every <strong>source</strong> URL or reference, one per line.
            This is how the team verifies your work.
          </li>
          <li>Click <strong>Save prospect</strong>. The form clears for the next company.</li>
          <li>Check the <strong>Recently added</strong> list to avoid duplicates before entering a company.</li>
        </ol>
      </Section>

      {/* Rules */}
      <Section icon={AlertTriangle} title="Rules">
        <ul className="space-y-2">
          <Bullet>
            <strong>Never invent data.</strong> Blank beats wrong. Every fact
            should trace to a source.
          </Bullet>
          <Bullet>
            <strong>Only use public information</strong> — company sites,
            LinkedIn, news, Chamber directories, the Indiana Manufacturers
            Association, Google Maps. No paywalled scraping, no private data.
          </Bullet>
          <Bullet>
            <strong>One company per submission.</strong> Don&rsquo;t combine
            multiple businesses into one entry.
          </Bullet>
          <Bullet>
            <strong>Check the Recently added list first</strong> so you
            don&rsquo;t enter the same company twice.
          </Bullet>
          <Bullet>
            <strong>Be honest about weak fits.</strong> A truthful 4/10 with
            notes is more useful than an inflated 8/10.
          </Bullet>
        </ul>
      </Section>

      {/* Where NOT to look */}
      <Section icon={Ban} title="Don't bother with">
        <ul className="space-y-2">
          <Bullet>Companies with no Fort Wayne-area presence.</Bullet>
          <Bullet>National chains / franchises where benefits are set at corporate HQ out of state.</Bullet>
          <Bullet>Sole proprietors or companies under ~10 employees (too small to contract).</Bullet>
          <Bullet>Government agencies (different, slower procurement — flag separately if you find a promising one, don&rsquo;t enter as a normal prospect).</Bullet>
        </ul>
      </Section>

      <div className="rounded-2xl bg-slate-900 p-6 text-slate-100">
        <h3 className="text-sm font-semibold">Quick reference — the one-liner</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Find privately-owned Fort Wayne-area employers with 25–250 people in
          manufacturing, logistics, or the trades — ideally self-funded — get
          the owner/CFO/HR contact, note why they&rsquo;re a fit and where you
          found it, score it honestly, and save one per submission.
        </p>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900">
        <Icon className="h-5 w-5 text-slate-500" />
        {title}
      </h2>
      <div className="text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function SubHeading({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h3 className="mt-5 mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </h3>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
      <span>{children}</span>
    </li>
  );
}

function ScoreRow({ range, label }: { range: string; label: string }) {
  return (
    <tr>
      <td className="w-16 bg-slate-50 px-3 py-2 text-center font-mono text-sm font-semibold text-slate-900">
        {range}
      </td>
      <td className="px-3 py-2 text-slate-700">{label}</td>
    </tr>
  );
}
