// ─────────────────────────────────────────────
// api/claude.js (Fully Synced with Real Backend)
// ─────────────────────────────────────────────

// বাংলা টেক্সট ডিটেক্ট করার জন্য ছোট্ট একটা ফাংশন
const detectLanguage = (text) => {
  const isBengali = /[\u0980-\u09FF]/.test(text);
  return isBengali ? "bn" : "en";
};

// ── Step 1: Classify Problem (/api/analyze) ──
export async function classifyProblem(text) {
  const payload = {
    problem: text,
    language: detectLanguage(text) // Auto detect 'en' or 'bn'
  };

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), 
  });
  
  if (!response.ok) throw new Error("API request failed on /api/analyze");
  return response.json(); 
}

// ── Step 3: Find Laws (/api/build-case) ──
export async function buildCase(caseData) {
  const payload = {
    problem: caseData.problemText,
    // যদি Step 1 থেকে entities না আসে, তবে ফাঁকা অবজেক্ট পাঠাবো
    entities: caseData.classification?.entities || { names: [], amounts: [] },
    evidence: caseData.documents || [],
    language: detectLanguage(caseData.problemText)
  };

  const response = await fetch("/api/build-case", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) throw new Error("Failed to build case");
  return response.json();
}

// ── Step 5: Risk Analysis (/api/risk-analysis) ──
export async function analyzeRisks(caseData) {
  const payload = {
    caseSummary: caseData.classification?.summary || caseData.problemText,
    evidence: caseData.documents || [],
    relevantLaws: caseData.laws || []
  };

  const response = await fetch("/api/risk-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

// ── Step 6: Opposition Agent (/api/opposition-agent) ──
export async function getOppositionArguments(caseData) {
  const payload = {
    caseSummary: caseData.classification?.summary || caseData.problemText,
    evidence: caseData.documents || [],
    relevantLaws: caseData.laws || []
  };

  const response = await fetch("/api/opposition-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

// ── Step 7: Draft Complaint (/api/generate-complain) ──
// Note: আপনার দেওয়া URL এ generate-complain লেখা আছে (t নেই), তাই সেটাই দিলাম
export async function generateComplaint(caseData) {
  const payload = {
    caseSummary: caseData.classification?.summary || caseData.problemText,
    timeline: caseData.timeline || [],
    evidence: caseData.documents || [],
    relevantLaws: caseData.laws || [],
    riskAnalysis: caseData.risks || {},
    language: detectLanguage(caseData.problemText) // detectLanguage ফাংশনটা আপনার ফাইলে আগে থেকেই আছে
  };

  const response = await fetch("/api/generate-complaint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
     throw new Error(`Failed to generate complaint: ${response.status}`);
  }
  return response.json();
}

// ── Extra: Similar Cases Search (/api/similar-cases) ──
// আপনার দেওয়া 5000 পোর্টের URL অনুযায়ী
export async function getSimilarCases(summary, domain) {
  const payload = {
    caseSummary: summary,
    domain: domain
  };

  // যদি এটা 5000 পোর্টে চলে, তবে ফুল URL দিতে হবে (নয়তো Proxy 8000 এ পাঠিয়ে দেবে)
  const response = await fetch("http://localhost:5000/api/similar-cases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}