// Fort Wayne Direct Primary Care — marketing content.
// Copy is plain American English, rewritten from the legacy site to remove
// SEO spam and non-native phrasing. Pricing pulled directly from the live
// site on 2026-04-09.

export const DPC_HOME = {
  hero: {
    eyebrow: "Direct Primary Care in Fort Wayne",
    title: "Primary care the way it should be.",
    subtitle:
      "Unhurried visits. Direct access to your doctor. One flat monthly fee — no insurance, no copays, no surprise bills.",
    primaryCta: { label: "Become a Member", href: "/membership" },
    secondaryCta: { label: "Schedule a Free Meet & Greet", href: "/contact" },
  },
  pillars: [
    {
      title: "Personal primary care",
      body:
        "A small patient panel means Dr. Aluri knows you. Appointments typically run 30 to 60 minutes so there is time to actually listen and treat the root cause.",
    },
    {
      title: "Direct urgent access",
      body:
        "Call, text, or video chat your doctor when something comes up. Same-day and next-day appointments are the norm — not the exception.",
    },
    {
      title: "Weight management built in",
      body:
        "Dr. Aluri is board-certified in Obesity Medicine and brings personal experience to the work. Lifestyle first, with medication support when it fits.",
    },
  ],
  memberPromise: {
    title: "Our promise to every member",
    items: [
      "No copays, ever",
      "No waiting rooms",
      "Unlimited phone, text, email, and video visits",
      "Direct access to your physician",
      "Urgent concerns handled the same day or next day",
    ],
  },
  included: {
    title: "What your membership includes",
    items: [
      "Executive health assessment",
      "Unlimited office visits",
      "In-office point-of-care testing",
      "E-visits and telehealth",
      "Discounted lab testing",
      "Wholesale pricing on medications",
      "Wholesale pricing on supplements",
      "Wholesale pricing on medical supplies",
      "DOT, immigration, and sports physicals",
    ],
  },
};

export const DPC_ABOUT = {
  hero: {
    eyebrow: "About the practice",
    title: "Healthcare that puts you first.",
    subtitle:
      "Dr. Kalyan Aluri started Fort Wayne Direct Primary Care to give the Allen County community access to the kind of attentive, preventative primary care he believed was missing from traditional insurance-driven clinics.",
  },
  story: [
    "Dr. Aluri is a family physician with more than two decades of experience in primary and urgent care. He earned his medical degree at MR Medical College, then completed his Family Practice residency at UPMC Mercy Hospital in Pittsburgh, Pennsylvania.",
    "He is board-certified in Family Medicine and Obesity Medicine, and holds a master's degree in Human Nutrition. His training also includes functional and lifestyle medicine — disciplines that sit at the intersection of diet, movement, sleep, stress, and the health outcomes that follow.",
    "During the pandemic, long hours and stress led to significant weight gain and chronic back pain. To get his own health back, Dr. Aluri pursued additional training in obesity medicine, lost 80 pounds, and has maintained it through the lifestyle changes he now shares with patients. That personal experience is the foundation of how he supports members struggling with their own weight.",
    "Fort Wayne Direct Primary Care is the result — a practice built around the patient-physician relationship, where the doctor actually has time to know you, and you have the access to be taken care of when something arises.",
  ],
  mission: {
    title: "Our mission",
    body:
      "To provide high-quality, comprehensive primary care that improves the health of the families we serve — one relationship at a time.",
  },
  values: [
    {
      title: "Time with your doctor",
      body:
        "Visits aren't rushed. The goal isn't throughput — it's understanding what's going on and building a real plan with you.",
    },
    {
      title: "Transparent pricing",
      body:
        "One monthly fee covers most of what you need. Anything extra is posted up front, in plain numbers, before it happens.",
    },
    {
      title: "Whole-person care",
      body:
        "Nutrition, movement, stress, sleep, and mental health are primary care — not footnotes. We treat them that way.",
    },
  ],
};

export const DPC_MEMBERSHIP = {
  hero: {
    eyebrow: "Membership",
    title: "Membership pricing.",
    subtitle:
      "One flat monthly fee covers almost everything. No insurance, no copays, no surprise bills. Pricing below is current as of 2026.",
  },
  enrollment: {
    perPatient: 75,
    familyMax: 200,
    note:
      "A one-time enrollment fee of $75 per patient applies, capped at $200 per family.",
  },
  tiers: [
    {
      id: "standard",
      name: "Standard",
      description:
        "For individuals. Care is billed monthly by age bracket — no household requirement.",
      featured: false,
      rows: [
        { label: "0 – 18 years", price: "$40/mo", note: "when a family adult is enrolled" },
        { label: "19 – 29 years", price: "$69/mo" },
        { label: "30 – 39 years", price: "$79/mo" },
        { label: "40 – 49 years", price: "$89/mo" },
        { label: "50 – 59 years", price: "$99/mo" },
        { label: "60 – 64 years", price: "$129/mo" },
      ],
      includes: [
        "Unlimited office visits",
        "Same-day and next-day appointments (when available)",
        "Telehealth, phone, text, and email with Dr. Aluri",
        "In-office point-of-care testing",
        "Wholesale pricing on medications and supplements",
      ],
    },
    {
      id: "family",
      name: "Family Plan",
      description:
        "Built for households. Whole families on one plan, one monthly bill.",
      featured: true,
      rows: [
        { label: "Family of 3 (2 adults, 1 child)", price: "$175/mo" },
        { label: "Family of 4 (2 adults, 2 children)", price: "$200/mo" },
        { label: "Each additional child", price: "+$35/mo" },
        { label: "Family maximum", price: "$300/mo" },
      ],
      includes: [
        "Everything in Standard",
        "One physician for the whole family",
        "Priority scheduling for household appointments",
        "After-hours access for pediatric concerns",
      ],
    },
    {
      id: "platinum",
      name: "Platinum",
      description:
        "Highest-touch tier. Built for members who want the most access and the most care included.",
      featured: false,
      rows: [
        { label: "All ages", price: "$250/mo" },
      ],
      includes: [
        "Everything in Standard and Family",
        "All point-of-care lab testing included",
        "Weight-management visits included",
        "One home visit per month included",
        "Unlimited virtual visits",
        "24/7 phone access",
      ],
    },
    {
      id: "college",
      name: "College Telemedicine",
      description:
        "For members ages 18 – 26 who are away at school and need reliable virtual access to a physician.",
      featured: false,
      rows: [
        { label: "Ages 18 – 26", price: "$50/mo" },
        { label: "In-person visit (if needed)", price: "+$75" },
      ],
      includes: [
        "Unlimited telehealth with Dr. Aluri",
        "Prescription management from anywhere",
        "Referrals home to Fort Wayne when appropriate",
      ],
    },
  ],
  services: {
    title: "À la carte services",
    note:
      "These are available to members and non-members. Member pricing is included with your plan where noted.",
    rows: [
      { label: "Home visit", member: "Included", nonMember: "$50" },
      { label: "School physical", member: "Included", nonMember: "$50" },
      { label: "Sports physical", member: "Included", nonMember: "$200" },
      { label: "DOT physical", member: "$100", nonMember: "$150" },
      { label: "Pre-op clearance", member: "Included", nonMember: "$150" },
      { label: "Wellness check", member: "Included", nonMember: "$100" },
      { label: "Work physical", member: "Included", nonMember: "$150" },
      { label: "Urgent care visit", member: "Contact us", nonMember: "Contact us" },
    ],
  },
};

export const DPC_WEIGHT_LOSS = {
  hero: {
    eyebrow: "Weight Loss & Aesthetics",
    title: "Weight management, done right.",
    subtitle:
      "Weight management is more than a number on a scale. Our programs combine nutrition, movement, and (when appropriate) medication — grounded in the experience of a physician who has walked it himself.",
  },
  programs: [
    {
      name: "SlimFit — Medication-Supported",
      subtitle: "When diet and movement alone are not enough.",
      body:
        "Combines a structured nutrition plan, lifestyle coaching, and modern weight-loss medications including semaglutide, tirzepatide, and compounded options. Dr. Aluri evaluates which medication fits your history and manages any side effects so you can stick with it.",
      bullets: [
        "Personalized prescription plan",
        "Monthly progress check-ins",
        "Nutrition plans built around real meals",
        "Side-effect management from day one",
      ],
    },
    {
      name: "New Wave — Supplement-Based Metabolic Reset",
      subtitle: "No medications, no shakes, no counting calories.",
      body:
        "A structured program that targets inflammation and hormone balance to reset your metabolism. Works with real food and doesn't require a gym membership or liquid diet.",
      bullets: [
        "Addresses inflammation and toxicity load",
        "Supports hormone balance",
        "No calorie counting or meal replacements",
        "Most members see steady, sustainable loss",
      ],
    },
  ],
  whatsIncluded: {
    title: "Every weight-loss program includes",
    items: [
      "Physical exam and health history",
      "Individualized lab order",
      "EKG",
      "Breath analysis with the Breezing Pro analyzer",
      "Styku 3D body scan",
      "Weight and body-composition analysis",
      "Nutritional assessment",
      "Exercise and lifestyle planning",
    ],
  },
  consultation: {
    inPerson: { price: 200, label: "In-person consultation" },
    virtual: { price: 150, label: "Virtual consultation" },
  },
};

export const DPC_CONTACT = {
  hero: {
    eyebrow: "Contact",
    title: "Get in touch.",
    subtitle:
      "Whether you're already a member or just curious about how DPC works, we'd love to hear from you. A meet and greet with Dr. Aluri is always free.",
  },
  heardAboutOptions: [
    "Search engine",
    "Online ad",
    "Social media",
    "News",
    "Direct mail",
    "Blog or publication",
    "Referral or word of mouth",
    "Other",
  ],
};
