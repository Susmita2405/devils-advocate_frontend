// ─────────────────────────────────────────────
// constants/steps.js
// Single source of truth for all step metadata.
// To add a new step: just add an entry here.
// ─────────────────────────────────────────────

export const STEPS = [
  {
    id: 1,
    label: "Describe problem",
    description: "Tell us what happened in your own words.",
  },
  {
    id: 2,
    label: "Upload documents",
    description: "Add receipts, agreements, or screenshots.",
  },
  {
    id: 3,
    label: "Laws found",
    description: "Relevant Indian laws matched to your case.",
  },
  {
    id: 4,
    label: "Case summary",
    description: "Auto-generated timeline and evidence list.",
  },
  {
    id: 5,
    label: "Risk analysis",
    description: "Specific weaknesses in your case.",
  },
  {
    id: 6,
    label: "Opposition",
    description: "What the other side will argue.",
  },
  {
    id: 7,
    label: "Final complaint",
    description: "Download your ready-to-file complaint.",
  },
];

export const TOTAL_STEPS = STEPS.length;