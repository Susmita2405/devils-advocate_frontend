// ─────────────────────────────────────────────
// api/claude.js
// All Claude API calls live here.
// Swap mock responses for real fetch() calls
// when you have your API key / backend ready.
// ─────────────────────────────────────────────

import { MOCK_CLASSIFICATION } from "../constants/mockData";

const USE_MOCK = true; // ← flip to false when backend is ready

// ── Helper ────────────────────────────────────
async function callClaude(prompt) {
  const response = await fetch("/api/claude", {   // your backend proxy
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error("API request failed");
  return response.json();
}

// ── Step 1: Classify the user's problem ───────
// Returns: { type, forum, confidence, summary }
export async function classifyProblem(text) {
  if (USE_MOCK) {
    await delay(1200);
    return MOCK_CLASSIFICATION;
  }

  const prompt = `
You are a legal AI assistant for India.
The user described their legal problem below.
Classify it and respond ONLY with valid JSON.

Problem: "${text}"

JSON format:
{
  "type": "short case type e.g. Property Fraud",
  "forum": "correct Indian forum/court",
  "confidence": "High | Medium | Low",
  "summary": "2-sentence plain-English explanation"
}
  `.trim();

  const data = await callClaude(prompt);
  return JSON.parse(data.text);
}

// ── Add more API functions below as you build ──
// export async function analyzeRisks(caseData) { ... }
// export async function generateComplaint(caseData) { ... }
// export async function getOppositionArguments(caseData) { ... }


// ── Internal ──────────────────────────────────
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}