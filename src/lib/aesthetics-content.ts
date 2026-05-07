// Indiana Weight Loss & Aesthetics — aesthetic-care content.
// Six campaign topics from the doctor's brief, organized as
// permanent on-page content + one time-limited promo (Mother's Day).
//
// IMPORTANT: flip MOTHERS_DAY_ACTIVE to false after May 31, 2026.
// The promo bar at the top of every page reads from this constant.

export const MOTHERS_DAY_ACTIVE = true;

export const AESTHETICS = {
  hero: {
    eyebrow: "Indiana Weight Loss & Aesthetics",
    title: "Aesthetic care, physician-led.",
    subtitle:
      "Botox, dermal fillers, and post-weight-loss volume restoration — under the same medical roof as Fort Wayne Direct Primary Care. Real medical supervision. Real expertise. Not a med spa.",
  },

  // Top-level service overview (3 cards)
  services: [
    {
      title: "Botox & wrinkle reduction",
      body: "Targeted neuromodulator treatments for forehead lines, frown lines, crow's feet, and jaw tension. Physician-supervised, dosed to your face — not a one-size protocol.",
    },
    {
      title: "Dermal fillers",
      body: "Hyaluronic-acid fillers for lips, cheeks, jawline, and under-eyes. Placed using advanced facial-block anesthesia so the appointment is virtually painless.",
    },
    {
      title: "Volume restoration after weight loss",
      body: "GLP-1 medications can leave faces looking gaunt. We rebuild what rapid weight loss took — strategically, so you still look like you.",
    },
  ],

  // Mother's Day — time-limited (May only)
  mothersDay: {
    eyebrow: "Mother's Day Special",
    headline: "$9/unit Botox.",
    headlineAccent: "All May. While slots last.",
    body: "Treat Mom — or yourself — to physician-supervised Botox at our lowest unit price of the year. Same medical oversight, same AAFE-certified provider, same painless technique. Just a better number.",
    phone: "260-547-7543",
    phoneHref: "tel:+12605477543",
    cta: { label: "Reserve a May appointment", href: "/contact" },
  },

  // Trust & expertise — who's actually doing the treatment
  providers: {
    eyebrow: "Trust & expertise",
    title: "An AAFE Certified Dentist, under physician supervision.",
    body: "Treatments are performed by a Certified Dentist credentialed by the American Academy of Facial Esthetics (AAFE) — the gold standard for non-surgical injectable training — and overseen by Dr. Kalyan Aluri, a board-certified family physician. You're getting medical care, not med-spa care. That's the difference.",
    bullets: [
      "American Academy of Facial Esthetics (AAFE) certification",
      "Performed under direct physician supervision",
      "Same office as Fort Wayne Direct Primary Care",
      "Treatment plans tailored to your face — not a protocol",
    ],
  },

  // Pain-control — comfort differentiator
  painControl: {
    eyebrow: "Comfort first",
    title: "Fillers without the fear.",
    body: "We use advanced facial-block anesthesia — the same targeted technique dentists use to numb a single tooth — before any filler is placed. By the time we start filling, you're completely numb in the treatment zone. Most patients tell us afterward they couldn't believe it didn't hurt.",
    bullets: [
      "Numb first, then fill",
      "Targeted blocks — not full-face numbness",
      "No bruising bias toward heavy-handed technique",
      "Most patients describe the experience as painless",
    ],
  },

  // Volume restoration — the bridge from weight loss to aesthetics
  volumeRestoration: {
    eyebrow: "Built for our weight-loss patients",
    title: "Restore what weight loss took.",
    body: "GLP-1 medications work — but rapid weight loss can leave the face looking gaunt, hollow, or older than it should. The “Ozempic face” effect is real, and it’s reversible. Our volume-restoration program is designed specifically for patients in the middle or end of a weight-loss journey, using fillers strategically to bring back natural shape without changing your face.",
    cta: { label: "Already a weight-loss patient? Talk to your doctor.", href: "/contact" },
    weightLossLink: { label: "See our weight-loss programs", href: "/weight-loss" },
  },

  // Weekend appointments — convenience
  weekend: {
    eyebrow: "Convenient hours",
    title: "Now booking weekend appointments.",
    body: "Saturday and Sunday slots are limited and fill quickly. Call to reserve, or email and we’ll get back to you the same business day.",
  },
};
