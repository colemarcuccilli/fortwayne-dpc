// Patient intake form — static lists.
// Organized as plain data so the form component stays declarative.
// All field names use snake_case so submission payloads are easy to
// consume on the server side (Supabase, API route, etc.).

export interface YesNoQuestion {
  name: string;
  label: string;
}

// ---------- Step 1 — Health & Wellness history ----------
export const BASIC_HEALTH_QUESTIONS: YesNoQuestion[] = [
  {
    name: "advised_weight_loss",
    label: "Has your doctor advised you to lose weight?",
  },
  {
    name: "feel_stressed",
    label: "Do you feel more stressed than usual?",
  },
  {
    name: "anxiety_depression_meds",
    label: "Are you on medication for anxiety or depression?",
  },
  {
    name: "dietary_restrictions",
    label: "Do you have any dietary restrictions?",
  },
  { name: "breast_feeding", label: "Are you currently breastfeeding?" },
  { name: "might_be_pregnant", label: "Might you be pregnant?" },
  { name: "pregnant", label: "Are you pregnant?" },
  {
    name: "family_thyroid_cancer",
    label: "Family or personal history of thyroid cancer?",
  },
  {
    name: "family_other_cancers",
    label: "Family or personal history of any other cancers?",
  },
  {
    name: "other_symptoms",
    label: "Any other symptoms associated with your chief complaint?",
  },
];

export const PAST_WEIGHT_LOSS_PROGRAMS: YesNoQuestion[] = [
  { name: "prog_weight_watchers", label: "Weight Watchers" },
  { name: "prog_never_tried", label: "I have never tried to lose weight" },
  { name: "prog_jenny_craig", label: "Jenny Craig / Nutrisystem" },
  { name: "prog_south_beach", label: "South Beach / Atkins diet" },
  { name: "prog_liquid", label: "Liquid diets" },
  { name: "prog_keto", label: "Keto diet" },
  { name: "prog_surgery", label: "Weight-loss surgery" },
  { name: "prog_medically_supervised", label: "Medically supervised treatment" },
  { name: "prog_phentermine", label: "Phentermine" },
  {
    name: "prog_other_meds",
    label: "Other OTC or prescription medications for weight loss",
  },
  {
    name: "prog_maintained_year",
    label: "Have you maintained loss for at least a year on any program?",
  },
  {
    name: "childhood_weight",
    label: "Did you have weight problems in childhood?",
  },
];

// ---------- Step 2 — Psychosocial Assessment ----------
export const PSYCHOSOCIAL_QUESTIONS: YesNoQuestion[] = [
  { name: "binge_eat", label: "Do you binge eat?" },
  {
    name: "uncontrolled_cravings",
    label: "Do you suffer from uncontrolled cravings?",
  },
  { name: "food_controls_you", label: "Do you feel that food controls you?" },
  { name: "eat_emotional", label: "Do you eat because of your emotions?" },
  { name: "eat_between_meals", label: "Do you eat between meals?" },
  {
    name: "eating_normal",
    label: "Do you feel your eating behaviors are normal?",
  },
  { name: "family_supports", label: "Does your family support your effort?" },
];

export const ACTIVITY_LEVELS = [
  {
    value: "light",
    label: "Light — no organized physical activity during leisure time",
  },
  {
    value: "moderate",
    label:
      "Moderate — occasional weekend activity (golf, tennis, jogging, swimming, cycling)",
  },
  {
    value: "heavy",
    label:
      "Heavy — consistent lifting, climbing, or active sports 3+ times a week",
  },
  {
    value: "inactive",
    label: "Inactive — no regular physical activity, sit-down job",
  },
  {
    value: "vigorous",
    label: "Vigorous — 60+ minute sessions of extensive exercise 4+ times a week",
  },
];

// ---------- Step 3 — Social History ----------
export const SOCIAL_QUESTIONS: YesNoQuestion[] = [
  { name: "smoke", label: "Do you currently smoke?" },
  { name: "past_smoker", label: "Are you a past smoker?" },
  { name: "smokeless_tobacco", label: "Do you use smokeless tobacco?" },
  { name: "ppd_tb", label: "Have you had PPD (TB) skin testing in the past?" },
  { name: "alcohol", label: "Do you drink alcohol?" },
  { name: "caffeine", label: "Do you use caffeine?" },
  {
    name: "recreational_drugs",
    label: "Do you use recreational drugs (cocaine, marijuana, methamphetamine)?",
  },
];

// ---------- Step 4 — Medication History ----------
export const MEDICATION_QUESTIONS: YesNoQuestion[] = [
  { name: "med_allergies", label: "Are you allergic to any medications?" },
  {
    name: "hospitalized",
    label: "Have you been hospitalized or had a surgical procedure?",
  },
];

export const FEMALE_QUESTIONS: YesNoQuestion[] = [
  { name: "menopause", label: "Have you been through menopause?" },
  { name: "ever_pregnant", label: "Have you ever been pregnant?" },
  { name: "currently_pregnant_nursing", label: "Pregnant or breastfeeding now?" },
];

// ---------- Step 5 — Mental Health ----------
export const MENTAL_HEALTH_QUESTIONS: YesNoQuestion[] = [
  { name: "stress_major", label: "Is stress a major problem for you?" },
  { name: "depressed", label: "Do you feel depressed often?" },
  { name: "panic_stressed", label: "Do you panic when stressed?" },
  { name: "appetite_problems", label: "Do you have problems with your appetite?" },
  { name: "cry_often", label: "Do you cry often?" },
  { name: "suicide_attempt", label: "Have you ever attempted suicide?" },
  { name: "self_harm", label: "Have you ever thought about injuring yourself?" },
  { name: "sleep_difficulty", label: "Do you have difficulty sleeping?" },
  { name: "seen_therapist", label: "Have you ever seen a counselor or therapist?" },
  {
    name: "inpatient_mental_health",
    label: "Have you received inpatient treatment for mental health or substance abuse?",
  },
];

export interface ReviewGroup {
  title: string;
  items: string[];
}

export const REVIEW_OF_SYSTEMS: ReviewGroup[] = [
  {
    title: "Constitutional",
    items: [
      "Weight gain",
      "Weight loss",
      "Fatigue",
      "Night sweats",
      "Appetite change",
      "Sweating",
    ],
  },
  {
    title: "Eyes",
    items: ["Glaucoma", "Vision loss", "Blurred or double vision"],
  },
  {
    title: "Ears / Nose / Throat / Mouth",
    items: [
      "Hearing loss",
      "Nasal congestion",
      "Snoring",
      "Mouth or throat irritation",
      "Tooth problems",
      "Seasonal allergies",
    ],
  },
  {
    title: "Respiratory",
    items: ["Shortness of breath", "Wheezing", "Cough"],
  },
  {
    title: "Cardiovascular",
    items: [
      "Chest pain or pressure",
      "High / low blood pressure",
      "Palpitations",
      "Heart attack",
      "Ankle swelling",
      "Heart failure",
      "Passing out",
    ],
  },
  {
    title: "Gastrointestinal",
    items: [
      "Nausea or vomiting",
      "Difficulty swallowing",
      "Abdominal pain",
      "Diarrhea",
      "Blood in stool",
      "Liver disease",
      "Heartburn",
      "Constipation",
    ],
  },
  {
    title: "Musculoskeletal",
    items: ["Muscle wasting", "Arthritis", "Pain", "Stiffness", "Weakness"],
  },
  {
    title: "Neurological",
    items: [
      "Stroke",
      "Insomnia",
      "Headache or migraine",
      "Dizziness or vertigo",
      "Seizures",
    ],
  },
  {
    title: "Mental health",
    items: [
      "Bipolar disorder",
      "Depression or anxiety",
      "ADHD / ADD",
      "Eating disorders",
    ],
  },
  {
    title: "Endocrine",
    items: [
      "Change in sex drive",
      "Cold or heat intolerance",
      "Thyroid problems",
      "Blood sugar problems",
      "Change in body hair",
      "Excessive thirst",
    ],
  },
  {
    title: "Integumentary",
    items: ["Skin rash", "Dry skin", "Eczema"],
  },
];

export const FAMILY_HISTORY_ITEMS = [
  "Anemia",
  "Allergies",
  "Alcoholism",
  "Alzheimer's",
  "Asthma",
  "Arthritis",
  "Autoimmune disorders",
  "ADD / ADHD",
  "Anxiety / depression",
  "Bleeding problems",
  "Blood clots",
  "Cancer",
  "Celiac disease",
  "Chronic fatigue",
  "Chronic pain",
  "COPD / emphysema",
  "Diabetes (type 1 or 2)",
  "Endometriosis",
  "Erectile dysfunction",
  "Fibromyalgia",
  "Gallstones",
  "GERD / acid reflux",
  "Glaucoma",
  "Gout",
  "Heart attack",
  "Heart disease",
  "Hepatitis",
  "High cholesterol",
  "Hormone disorders",
  "Hypertension",
  "HIV / AIDS",
  "Kidney disease",
  "Kidney stones",
  "Lung disease",
  "Rheumatoid arthritis",
  "Seizures / epilepsy",
  "Sleep problems",
  "Stroke",
  "Stomach ulcers",
  "Thyroid disease",
  "Urinary problems",
  "Weight problems",
];

export const IMPORTANT_ELEMENT_OPTIONS = [
  {
    value: "effectiveness",
    label: "Effectiveness",
    body: "Results are my top priority.",
  },
  {
    value: "time",
    label: "Time",
    body: "I want results quickly.",
  },
  {
    value: "service",
    label: "Service",
    body: "I need extra support along the way.",
  },
  {
    value: "affordability",
    label: "Affordability",
    body: "I need this to be affordable.",
  },
];

export const HEARD_ABOUT_OPTIONS = [
  "Search engine (Google, Bing, Yahoo, etc.)",
  "Online ad",
  "Social media",
  "News",
  "Direct mail",
  "Blog or publication",
  "Referral or word of mouth",
  "Other",
];

export const RACE_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Pacific Islander",
  "White",
  "Two or more",
  "Prefer not to say",
];

export const SEX_OPTIONS = ["Male", "Female", "Other"];

export const STEPS = [
  { id: 1, label: "Health & Wellness History" },
  { id: 2, label: "Psychosocial Assessment" },
  { id: 3, label: "Social History" },
  { id: 4, label: "Medication History" },
  { id: 5, label: "Mental Health" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
