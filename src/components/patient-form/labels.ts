// Maps patient-intake field names to readable labels for the admin view
// and CSV export. Built from the question banks (so yes/no questions read
// exactly as the patient saw them) plus a manual map for the free-text /
// personal-info fields, with a humanizer fallback for anything unmapped.

import {
  BASIC_HEALTH_QUESTIONS,
  PAST_WEIGHT_LOSS_PROGRAMS,
  PSYCHOSOCIAL_QUESTIONS,
  SOCIAL_QUESTIONS,
  MEDICATION_QUESTIONS,
  FEMALE_QUESTIONS,
  MENTAL_HEALTH_QUESTIONS,
  REVIEW_OF_SYSTEMS,
} from "@/components/patient-form/data";

// name -> label from every yes/no question bank
const QUESTION_LABELS: Record<string, string> = {};
[
  BASIC_HEALTH_QUESTIONS,
  PAST_WEIGHT_LOSS_PROGRAMS,
  PSYCHOSOCIAL_QUESTIONS,
  SOCIAL_QUESTIONS,
  MEDICATION_QUESTIONS,
  FEMALE_QUESTIONS,
  MENTAL_HEALTH_QUESTIONS,
].forEach((bank) => {
  bank.forEach((q) => {
    QUESTION_LABELS[q.name] = q.label;
  });
});

// review-of-systems checkbox groups: ros_<slug> -> "<Group> symptoms"
REVIEW_OF_SYSTEMS.forEach((group) => {
  const key = `ros_${group.title.toLowerCase().replace(/[^a-z]+/g, "_")}`;
  QUESTION_LABELS[key] = `${group.title} symptoms`;
});

// Manual labels for the free-text / personal-info / consent fields.
const MANUAL_LABELS: Record<string, string> = {
  first_name: "First name",
  last_name: "Last name",
  form_date: "Form date",
  dob: "Date of birth",
  home_phone: "Home phone",
  cell_phone: "Cell phone",
  email: "Email",
  sex: "Sex",
  race: "Race",
  occupation: "Occupation",
  address: "Street address",
  city: "City",
  state: "State",
  zip: "Zip",
  heard_about: "How did you hear about us?",
  pharmacy_name: "Pharmacy name",
  pharmacy_phone: "Pharmacy phone",
  pharmacy_address: "Pharmacy address",
  pharmacy_city: "Pharmacy city",
  pharmacy_state: "Pharmacy state",
  pharmacy_zip: "Pharmacy zip",
  pcp_name: "Primary care physician",
  pcp_phone: "PCP phone",
  pcp_address: "PCP address",
  pcp_city: "PCP city",
  pcp_state: "PCP state",
  pcp_zip: "PCP zip",
  chief_complaint: "Main reason for visit",
  weight_affects_life: "How weight affects daily life",
  caused_weight_gain: "What caused the weight gain",
  main_reason_treatment: "Main reason seeking treatment",
  goal_weight: "Goal weight",
  last_ideal_weight: "Last at ideal weight",
  amount_to_lose: "Amount to lose",
  diet_frequency: "How often they diet",
  motivation: "Motivation to lose weight",
  hardest_part: "Hardest part of managing weight",
  challenges: "Challenges to overcome",
  lowest_weight: "Lowest adult weight",
  lowest_weight_when: "Lowest weight — when",
  heaviest_weight: "Heaviest adult weight",
  heaviest_weight_when: "Heaviest weight — when",
  eating_pattern: "Eating behaviors & pattern",
  commitment_rating: "Commitment rating (1–10)",
  activity_level: "Activity level",
  smoking_packs: "Smoking — packs per day",
  smoking_duration: "Smoking — duration",
  quit_smoking_date: "Quit smoking date",
  smokeless_duration: "Smokeless tobacco duration",
  alcohol_amount: "Alcohol — amount & frequency",
  caffeine_amount: "Caffeine — amount & frequency",
  exercise_habits: "Exercise habits",
  recreational_drug_details: "Recreational drug details",
  allergy_medication: "Allergy — medication",
  allergy_dosage: "Allergy — dosage",
  allergy_frequency: "Allergy — frequency",
  allergy_reaction: "Allergy — reaction",
  surgery_type: "Surgery / illness",
  surgery_date: "Surgery date",
  surgery_physician: "Surgery physician",
  surgery_hospital: "Surgery hospital",
  last_pap_date: "Last Pap smear",
  last_mammogram_date: "Last mammogram",
  last_period: "Last menstrual period",
  birth_control_method: "Birth control method",
  last_physical_date: "Last physical exam",
  last_prostate_exam: "Last prostate / rectal exam",
  family_history: "Family / personal history",
  most_important: "What matters most",
  additional_notes: "Additional notes",
  consent_medication: "Medication consent",
  consent_records: "Records consent & attestation",
  signature: "Signature (typed name)",
  signature_date: "Signature date",
  relationship: "Relationship to patient",
};

function humanize(key: string): string {
  const s = key.replace(/_/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function patientFieldLabel(key: string): string {
  return MANUAL_LABELS[key] ?? QUESTION_LABELS[key] ?? humanize(key);
}

// Ordered sections so the admin view groups fields the way the patient
// filled them. Any field not listed here falls into an "Other" bucket.
export const PATIENT_SECTIONS: { title: string; keys: string[] }[] = [
  {
    title: "Patient information",
    keys: [
      "first_name", "last_name", "form_date", "dob", "home_phone", "cell_phone",
      "email", "sex", "race", "occupation", "address", "city", "state", "zip",
      "heard_about",
    ],
  },
  {
    title: "Pharmacy & primary care physician",
    keys: [
      "pharmacy_name", "pharmacy_phone", "pharmacy_address", "pharmacy_city",
      "pharmacy_state", "pharmacy_zip", "pcp_name", "pcp_phone", "pcp_address",
      "pcp_city", "pcp_state", "pcp_zip",
    ],
  },
  {
    title: "Health & wellness history",
    keys: [
      ...BASIC_HEALTH_QUESTIONS.map((q) => q.name),
      "chief_complaint", "weight_affects_life", "caused_weight_gain",
      "main_reason_treatment", "goal_weight", "last_ideal_weight",
      "amount_to_lose", "diet_frequency", "motivation", "hardest_part",
      "challenges", ...PAST_WEIGHT_LOSS_PROGRAMS.map((q) => q.name),
      "lowest_weight", "lowest_weight_when", "heaviest_weight", "heaviest_weight_when",
    ],
  },
  {
    title: "Psychosocial assessment",
    keys: [
      ...PSYCHOSOCIAL_QUESTIONS.map((q) => q.name),
      "eating_pattern", "commitment_rating", "activity_level",
    ],
  },
  {
    title: "Social history",
    keys: [
      ...SOCIAL_QUESTIONS.map((q) => q.name),
      "smoking_packs", "smoking_duration", "quit_smoking_date",
      "smokeless_duration", "alcohol_amount", "caffeine_amount",
      "exercise_habits", "recreational_drug_details",
    ],
  },
  {
    title: "Medication history",
    keys: [
      ...MEDICATION_QUESTIONS.map((q) => q.name),
      "allergy_medication", "allergy_dosage", "allergy_frequency", "allergy_reaction",
      "surgery_type", "surgery_date", "surgery_physician", "surgery_hospital",
      ...FEMALE_QUESTIONS.map((q) => q.name),
      "last_pap_date", "last_mammogram_date", "last_period", "birth_control_method",
      "last_physical_date", "last_prostate_exam",
    ],
  },
  {
    title: "Mental health, review of systems & consent",
    keys: [
      ...MENTAL_HEALTH_QUESTIONS.map((q) => q.name),
      ...REVIEW_OF_SYSTEMS.map(
        (g) => `ros_${g.title.toLowerCase().replace(/[^a-z]+/g, "_")}`,
      ),
      "family_history", "most_important", "additional_notes",
      "consent_medication", "consent_records", "signature", "signature_date",
      "relationship",
    ],
  },
];

/** Format a stored value for display / export. */
export function formatFieldValue(v: string | string[]): string {
  return Array.isArray(v) ? v.join(", ") : v;
}
