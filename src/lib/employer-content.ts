// Fort Wayne DPC — "For Business" (employer) content.
//
// Source of truth: Dr. Aluri's "Employer Healthcare Partnership Program"
// + "Employer ROI Advantage" one-pager. This is the REAL program:
//   • Flat $79 per employee per month ($948/yr). No enrollment fees,
//     copays, deductibles, or surprise bills.
//   • The pitch is access -> fewer avoidable costs (urgent care, ER,
//     missed workdays, turnover), NOT a self-funded claims-reduction %.
//
// All tunable economics live in EMPLOYER_ECONOMICS so the calculator and
// ROI sheet stay in sync and are easy to adjust.

// -------------------- ECONOMICS (single source of truth) --------------------

export const EMPLOYER_ECONOMICS = {
  pepm: 79,
  annualPerEmployee: 79 * 12, // 948

  // Cost benchmarks the ROI is built on (from the program doc). Shown
  // openly so the numbers are defensible, not hype.
  costPerUrgentCare: 200, // doc: $150–$250+
  costPerErVisit: 2000, // doc: $1,500–$3,000+ (conservative floor)
  costPerMissedWorkday: 300, // doc: 20 workdays ≈ $4,000–$8,000
  costPerTurnover: 4000, // recruiting + training (conservative)

  // Default avoidable events PER EMPLOYEE / year — calibrated to the doc's
  // 20-employee example (10 urgent care, 2 ER, 20 workdays for 20 staff).
  defaultUrgentCarePerEmp: 0.5,
  defaultErPerEmp: 0.1,
  defaultWorkdaysPerEmp: 1.0,
  defaultTurnoverAvoidedPer100: 5, // ~1 per 20 employees
} as const;

// -------------------- PAGE COPY --------------------

export const EMPLOYERS = {
  hero: {
    eyebrow: "For Fort Wayne Employers",
    title: "Give your team real healthcare — for less than the cost of one missed workday a month.",
    subtitle:
      "Fort Wayne Direct Primary Care gives your employees unlimited, same-day access to their own physician — no copays, no deductibles, no insurance barriers — for a flat $79 per employee per month. Healthier employees, fewer avoidable costs, and a benefit they'll actually use.",
    primaryCta: { label: "See your ROI in 30 seconds", href: "#estimate" },
    secondaryCta: { label: "Book a 15-minute consult", href: "/contact" },
  },

  // The sales hook line straight from the doc.
  hook: "If we could give your employees same-day physician access for less than the cost of one missed workday a month — would that be worth a 15-minute conversation?",

  // How it works: one flat price, three ways to offer it.
  howItWorks: {
    eyebrow: "How it works",
    title: "One flat price. Three ways to offer it.",
    price: {
      amount: "$79",
      unit: "per employee / month",
      annual: "$948 per employee / year",
      includes: [
        "No enrollment fees",
        "No copays",
        "No deductibles",
        "No surprise bills",
      ],
    },
    options: [
      {
        title: "Fully sponsor it",
        body: "Cover the full membership for your team as a premium benefit.",
      },
      {
        title: "Share the cost",
        body: "Split the monthly fee with employees — a low-cost perk for everyone.",
      },
      {
        title: "Voluntary benefit",
        body: "Offer it employee-paid at your group rate. Zero cost to the company.",
      },
    ],
  },

  // What's included — the full service list from the program doc.
  included: {
    eyebrow: "What's included",
    title: "Comprehensive primary care, no fine print.",
    groups: [
      {
        title: "Access",
        items: [
          "Unlimited primary care visits",
          "Same-day or next-day appointments",
          "Direct physician access — secure message, phone, telehealth",
          "Extended 30–60 minute visits",
        ],
      },
      {
        title: "Preventive & chronic care",
        items: [
          "Annual wellness visits & health screenings",
          "Preventive counseling & risk assessment",
          "Blood pressure, diabetes, cholesterol management",
          "Asthma, thyroid, obesity & weight management",
        ],
      },
      {
        title: "Everyday & coordinated care",
        items: [
          "Acute care — infections, minor injuries, skin, allergies",
          "Telehealth visits to cut employee downtime",
          "Care coordination with specialists & hospitals",
          "Discounted labs, imaging & cash-pay specialty services",
        ],
      },
    ],
  },

  // The ROI story — the "hidden cost of traditional healthcare" from the doc.
  roi: {
    eyebrow: "The employer ROI advantage",
    title: "The real question isn't whether you can afford it.",
    subtitle:
      "It's whether you can afford the cost of delayed care, absenteeism, and unnecessary ER and urgent-care visits. Here's what those cost today — and how one flat fee heads them off.",
    hiddenCosts: [
      {
        label: "One urgent care visit",
        amount: "$150–$250+",
        detail: "Plus hours away from work for something a primary care office could handle.",
      },
      {
        label: "One ER visit",
        amount: "$1,500–$3,000+",
        detail: "Many ER visits start as manageable problems that weren't addressed early.",
      },
      {
        label: "Poorly managed chronic disease",
        amount: "Ongoing",
        detail: "Drives absenteeism, lost productivity, higher spend, and workplace injuries.",
      },
      {
        label: "Long waits for appointments",
        amount: "Days–weeks",
        detail: "Lost productivity, delayed treatment, and more urgent care visits.",
      },
    ],
    exampleNote:
      "Example — a 20-employee company invests $18,960/year. Avoiding just 10 urgent-care visits, 2 ER visits, and 20 missed workdays — plus retaining a single employee — can offset much or all of that. Run your own numbers below.",
  },

  // Ideal employer groups — helps a business owner self-identify.
  idealGroups: {
    eyebrow: "Who it's for",
    title: "Built for Fort Wayne's working businesses.",
    subtitle: "Especially valuable for small and mid-sized employers with 5–250 people:",
    groups: [
      "Manufacturing",
      "Construction",
      "Transportation & logistics",
      "Professional offices",
      "Churches & non-profits",
      "Restaurants & hospitality",
    ],
  },

  // Benefits for employers (summary tiles).
  benefits: {
    eyebrow: "Why employers choose us",
    title: "Healthier team, predictable cost, easier hiring.",
    items: [
      { title: "Less absenteeism", body: "Timely care means fewer hours and days lost to waiting rooms." },
      { title: "Fewer ER & urgent-care bills", body: "Most concerns get handled in primary care before they escalate." },
      { title: "Happier employees", body: "Direct access to a doctor who actually knows them." },
      { title: "Healthier workforce", body: "Early detection and management cut complications and downtime." },
      { title: "Predictable spend", body: "One simple monthly fee — no surprise charges." },
      { title: "Recruiting edge", body: "A healthcare benefit people can actually use and value." },
    ],
  },

  // Optional wellness add-ons.
  wellnessAddon: {
    eyebrow: "Optional add-on",
    title: "Add weight & metabolic wellness for your team.",
    body: "Obesity and metabolic conditions are among the largest and fastest-growing drivers of employer healthcare cost. Through Indiana Weight Loss & Aesthetics (Dr. Aluri's sister practice), you can layer on physician-led weight management — GLP-1 programs, body-composition analysis, metabolic assessments, nutrition counseling, and executive physicals. Additional fees may apply.",
    cta: { label: "See the weight-loss program", href: "/weight-loss" },
  },

  // Employer FAQ — beyond the doc, handles the common objections.
  faq: {
    eyebrow: "Common questions",
    title: "Straight answers.",
    items: [
      {
        q: "We already offer health insurance. Why add this?",
        a: "DPC isn't insurance and doesn't replace it — it works alongside it. It handles the day-to-day care (visits, chronic disease, minor illness) that your plan makes slow and expensive, so your people get care faster and your plan sees fewer claims. Many employers pair DPC with a leaner high-deductible plan to bring premiums down.",
      },
      {
        q: "What if some employees don't use it?",
        a: "That's why we offer it three ways. You can fully sponsor it, split the cost, or offer it as a voluntary employee-paid benefit at your group rate — so you're never paying for coverage nobody uses.",
      },
      {
        q: "Is there a minimum size?",
        a: "We work with businesses from about 5 employees up to 250. Whether you're a small office or a mid-sized manufacturer, the model scales the same way.",
      },
      {
        q: "How do employees actually get care?",
        a: "Same-day or next-day in-office visits, plus direct access to Dr. Aluri by secure message, phone, and telehealth. Visits run 30–60 minutes — enough time to actually solve the problem.",
      },
      {
        q: "How do we get started?",
        a: "A 15-minute call. We confirm your headcount and how you want to offer it, set a start date, and handle enrollment for your team. No long procurement process.",
      },
    ],
  },

  // Simple 3-step onboarding.
  steps: {
    eyebrow: "Getting started",
    title: "Three steps to a healthier team.",
    steps: [
      { n: "01", title: "Book a 15-minute call", body: "We learn your team size and how you'd like to offer it." },
      { n: "02", title: "Pick your setup", body: "Fully sponsored, cost-shared, or voluntary — your call." },
      { n: "03", title: "We onboard your team", body: "Enrollment handled for you. Employees start using care right away." },
    ],
  },

  finalCta: {
    title: "Let's run your company's numbers.",
    body: "Fifteen minutes. We'll confirm your headcount, show you the ROI on your real numbers, and leave you with a one-page summary for your team.",
    primaryCta: { label: "Book a 15-minute employer consult", href: "/contact" },
  },
};
