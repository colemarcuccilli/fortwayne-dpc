// Campaign phrases — the short, punchy lines that run as a ticker under
// the hero and as oversized pull-quotes between sections.
//
// Cole's original brief included: "Text Your Doctor, seriously", "same day
// answers", "no waiting rooms", "no copays". The rest were written to
// match the same voice — direct, short, American English.

export const MARQUEE_PHRASES = [
  "Text your doctor. Seriously.",
  "Same-day answers.",
  "No waiting rooms.",
  "No copays.",
  "30–60 minute visits.",
  "Urgent care included.",
  "One doctor. For your whole family.",
  "Call. Text. Video. Anytime.",
  "No insurance required.",
  "Board-certified obesity medicine.",
  "Wholesale pricing on medications.",
  "A flat monthly fee. That's it.",
];

/**
 * Oversized pull-quotes placed between sections. The first line is the
 * hook (rendered in brand blue), the second is the softener (terracotta).
 */
export const CALLOUTS = {
  textYourDoctor: {
    primary: "Text your doctor.",
    accent: "Seriously.",
    body: "Not a receptionist. Not a nurse line. Not a chatbot. Dr. Aluri himself — at the other end of the message.",
  },
  noCopays: {
    primary: "No copays.",
    accent: "No waiting rooms. Ever.",
    body: "One flat monthly fee covers your visits, your messaging, your point-of-care testing, and the relationship with a doctor who actually knows you.",
  },
  sameDay: {
    primary: "Same-day answers.",
    accent: "Next-day visits.",
    body: "When something's wrong, you shouldn't have to wait two weeks to be seen. As a member, you never will.",
  },
  inYourPocket: {
    primary: "Your doctor,",
    accent: "in your pocket.",
    body: "Call, text, email, or video chat — whatever works for the moment. That's what direct access actually looks like.",
  },
  unhurried: {
    primary: "30–60 minute visits.",
    accent: "Unhurried. Every time.",
    body: "We cap the patient panel on purpose so Dr. Aluri has time to know you, listen to you, and actually figure out what's going on.",
  },
};

export type CalloutKey = keyof typeof CALLOUTS;
