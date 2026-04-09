// Shared content across both brands. Both businesses have the same owner,
// physician, address, phone, and email, so this lives in one place.
// Brand-specific content (copy, services, pricing) lives in the per-brand
// content files.

export const PRACTICE = {
  physician: {
    name: "Dr. Kalyan Aluri",
    credentials: "MD, ABFM, ABOM",
    shortTitle: "Family Physician",
    longTitle:
      "Board-certified family physician and obesity medicine specialist",
    yearsExperience: 20,
    education: [
      {
        degree: "Doctor of Medicine",
        school: "MR Medical College",
      },
      {
        degree: "Family Practice Residency",
        school: "UPMC Mercy Hospital, Pittsburgh, PA",
      },
      {
        degree: "Master of Science, Human Nutrition",
        school: "Post-graduate studies",
      },
    ],
    boards: [
      "Board-Certified — American Board of Family Medicine",
      "Board-Certified — American Board of Obesity Medicine (ABOM)",
    ],
  },
  address: {
    street: "4630 W Jefferson Blvd, Suite 8",
    city: "Fort Wayne",
    state: "IN",
    zip: "46804",
  },
  phone: "260-547-7543",
  phoneHref: "tel:+12605477543",
  fax: "260-234-3295",
  email: "info@fortwaynedpc.com",
  emailHref: "mailto:info@fortwaynedpc.com",
  hours: {
    primaryCare: [
      { day: "Monday", open: "10:00 AM", close: "5:00 PM" },
      { day: "Tuesday", open: "9:00 AM", close: "5:00 PM" },
      { day: "Wednesday", open: "10:00 AM", close: "5:00 PM" },
      { day: "Thursday", open: "9:00 AM", close: "5:00 PM" },
      { day: "Friday", open: "10:00 AM", close: "5:00 PM" },
    ],
    urgentCare: [
      { day: "Monday – Friday", open: "5:00 PM", close: "8:00 PM" },
      { day: "Saturday – Sunday", open: "10:00 AM", close: "4:00 PM" },
    ],
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61566550573045",
    instagram: "https://www.instagram.com/fortwaynedpc/",
    linkedin: "https://www.linkedin.com/company/fort-wayne-direct-primary-care/",
  },
} as const;
