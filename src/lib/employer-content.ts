// Fort Wayne DPC — "For Business" (employer) marketing content.
//
// Strategy basis: alignedmarketplace.com (sell the employer OUTCOME —
// lower total spend + better benefit) + costpluswellness.com (transparency
// is a local independent's unfair advantage). See the strategy doc.
//
// ⚠️ PLACEHOLDER ECONOMICS: the pricing + savings assumptions below are
// defensible market defaults, NOT Dr. Aluri's confirmed numbers. Every
// tunable value is a single constant here so it's trivial to change once
// the real PEPM pricing and any local claims data are provided.

// -------------------- ECONOMICS CONFIG (change these) --------------------

export const EMPLOYER_ECONOMICS = {
  // Modeled employer price per employee per month. PLACEHOLDER — confirm.
  pepm: 89,

  // National-ish default for employer healthcare cost per employee / year,
  // used only as a prefill the user overrides with their real number.
  defaultSpendPerEmployee: 10000,

  // NET total-cost reduction we MODEL (already net of the DPC fee), by plan
  // type. Deliberately conservative floors — the literature cites 15–30% for
  // self-funded employers who pair DPC with a leaner plan design. We model
  // the low end and show the math so a skeptical CFO can trust it.
  reduction: {
    self_funded: 0.15, // conservative floor of the 15–30% range
    level_funded: 0.15,
    fully_insured: 0.08, // can't capture claims directly; renewal + productivity
    unknown: 0.1,
  },

  // Range labels shown alongside the modeled number (transparency).
  reductionRangeLabel: {
    self_funded: "15–30%",
    level_funded: "15–30%",
    fully_insured: "5–15%",
    unknown: "varies",
  },
} as const;

export type EmployerPlanType = keyof typeof EMPLOYER_ECONOMICS.reduction;

export const PLAN_TYPE_OPTIONS: { value: EmployerPlanType; label: string; hint: string }[] = [
  {
    value: "self_funded",
    label: "Self-funded",
    hint: "We pay our employees' claims directly (TPA / stop-loss).",
  },
  {
    value: "level_funded",
    label: "Level-funded",
    hint: "Fixed monthly cost with a year-end refund of unused claims.",
  },
  {
    value: "fully_insured",
    label: "Fully insured",
    hint: "A traditional group plan through a carrier.",
  },
  {
    value: "unknown",
    label: "Not sure",
    hint: "We'll figure it out together on the call.",
  },
];

// -------------------- PUBLISHED PRICING (transparency) --------------------

export const EMPLOYER_PRICING = {
  note: "Transparent, flat pricing. No spread, no hidden fees, no per-visit copays. One simple contract.",
  tiers: [
    { label: "Per employee", price: "$89", unit: "/mo" },
    { label: "+ Spouse", price: "$79", unit: "/mo" },
    { label: "+ Each dependent", price: "$25", unit: "/mo", note: "capped at 3" },
  ],
  disclaimer:
    "Pricing shown is our standard employer rate. Final pricing is confirmed on your consult based on headcount and plan design.",
};

// -------------------- PAGE COPY --------------------

export const EMPLOYERS = {
  hero: {
    eyebrow: "For Fort Wayne Employers",
    title: "Cut your company's healthcare costs — without cutting benefits.",
    subtitle:
      "A membership that gives your team unlimited, same-day primary care with no copays, and lowers your company's total healthcare spend while doing it. Local, independent, and transparent.",
    primaryCta: { label: "Get your custom savings estimate", href: "#estimate" },
    secondaryCta: { label: "Book a 15-minute employer consult", href: "/contact" },
  },

  dualPromise: {
    eyebrow: "The rare part",
    title: "A better benefit AND a lower cost.",
    body: "Most benefits decisions are a trade-off — spend more for better coverage, or cut coverage to save. Direct primary care is one of the few moves that does both: your people get real, unhurried access to a doctor, and your company spends less on the downstream costs that actually drive your bill.",
  },

  whoGetsWhat: {
    eyebrow: "Who gets what",
    columns: [
      {
        title: "Your employees get",
        items: [
          "Unlimited visits — no copays, ever",
          "Same-day and next-day appointments",
          "Direct call / text / video with a real doctor",
          "30–60 minute visits, not 7",
          "Labs, and meds at wholesale cost",
        ],
      },
      {
        title: "Your company gets",
        items: [
          "Lower total healthcare spend",
          "Fewer ER visits and specialist referrals",
          "Less absenteeism, more productivity",
          "A benefit that helps you recruit and keep people",
          "Chronic conditions actually managed",
        ],
      },
      {
        title: "How it works",
        items: [
          "One simple contract — transparent PEPM",
          "Flat per-employee monthly fee",
          "No insurance billing, no spread pricing",
          "Pairs with a leaner health plan to cut premiums",
          "Onboarding handled for your team",
        ],
      },
    ],
  },

  buyerTypes: {
    eyebrow: "Two ways this saves you money",
    title: "It depends on how you fund healthcare today.",
    cards: [
      {
        tag: "Self-funded / level-funded",
        title: "You pay claims — so you keep the savings.",
        body: "When our membership prevents ER visits, specialist referrals, and hospitalizations, those avoided claims land straight in your pocket. This is where the 15–30% total-cost reductions come from. We'll model it against your real numbers.",
        highlight: "Biggest, most direct savings.",
      },
      {
        tag: "Fully insured",
        title: "A premium benefit at a small-business price.",
        body: "You can't capture claims savings directly — so the win is people and productivity: far less absenteeism, easier recruiting and retention, and the option to pair DPC with a leaner high-deductible plan to bring your premium down at renewal.",
        highlight: "Better benefit, lower renewal.",
      },
    ],
  },

  mechanism: {
    eyebrow: "Where the savings actually come from",
    title: "No magic — just fewer expensive claims.",
    body: "We don't ask you to trust a headline number. Here's the mechanism, and we show our math openly.",
    points: [
      {
        stat: "60–80%",
        label: "of urgent + primary care handled inside the membership",
        detail: "Fewer ER visits, fewer specialist referrals, fewer downstream claims.",
      },
      {
        stat: "80–90%",
        label: "below insurance rates on labs & imaging",
        detail: "Wholesale / cash pricing passed straight through to you.",
      },
      {
        stat: "Same-day",
        label: "access diverts non-emergencies from the ER",
        detail: "ER visits are one of the largest avoidable line items on your bill.",
      },
      {
        stat: "30–60 min",
        label: "visits keep people at work and conditions controlled",
        detail: "Less absenteeism; chronic disease managed before it becomes a claim.",
      },
    ],
    honesty:
      "A note on numbers: we lead with conservative ranges and the reason costs drop — not cherry-picked case studies. Once you're a client, we replace these estimates with your own utilization data and measure the real result.",
  },

  trust: {
    eyebrow: "Why us",
    title: "Local, independent, and transparent — by design.",
    points: [
      {
        title: "A named local physician",
        body: "Dr. Kalyan Aluri — board-certified in Family Medicine and Obesity Medicine — not a rotating call center. Your team sees the same doctor every time.",
      },
      {
        title: "We publish our price",
        body: "No spread pricing, no hidden contracts, no surprise fees. As a local independent, transparency is something a national carrier structurally can't match.",
      },
      {
        title: "One simple contract",
        body: "A flat per-employee monthly fee. No insurance billing games. You can see exactly what you pay and exactly what your team gets.",
      },
    ],
  },

  wellnessAddon: {
    eyebrow: "Optional add-on",
    title: "Add weight & metabolic care for your team.",
    body: "Obesity and metabolic conditions are one of the largest and fastest-growing drivers of employer healthcare cost — and morale. Indiana Weight Loss & Aesthetics (Dr. Aluri's sister practice) offers physician-led weight management, including GLP-1 programs, as an employer wellness add-on. A tangible cost-and-culture win you can layer on top of the membership.",
    cta: { label: "See the weight-loss program", href: "/weight-loss" },
  },

  finalCta: {
    title: "Let's model your company's opportunity.",
    body: "A 15-minute call is all it takes. We'll qualify your plan type, run the numbers against your headcount, and leave you with a one-page savings estimate you can take to your team.",
    primaryCta: { label: "Book a 15-minute employer consult", href: "/contact" },
  },
};
