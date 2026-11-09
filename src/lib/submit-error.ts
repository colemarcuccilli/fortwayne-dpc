// Shared, honest failure copy for the public forms. If we didn't actually
// receive a submission we say so and give the visitor a way through
// (the office phone) instead of showing a false confirmation.

import { PRACTICE } from "@/lib/site-data";

type Reason = "captcha" | "rejected" | "network";

export function SUBMIT_ERROR(reason: Reason): string {
  const phone = PRACTICE.phone;
  switch (reason) {
    case "captcha":
      return `We couldn't verify that you're human. Please complete the check and try again, or call us at ${phone}.`;
    case "rejected":
      return `Something in the form didn't go through. Please check your entries and try again, or call us at ${phone}.`;
    default:
      return `We couldn't reach the office just now, so this wasn't sent. Please try again in a moment, or call us at ${phone}.`;
  }
}
