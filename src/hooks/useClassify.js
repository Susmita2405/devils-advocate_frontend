// ─────────────────────────────────────────────
// hooks/useClassify.js
// Handles all state for the Step 1 classification.
// Keeps Step1/index.jsx clean — zero API logic there.
// ─────────────────────────────────────────────

import { useState } from "react";
import { classifyProblem } from "../api/claude";

export function useClassify() {
  const [status, setStatus]   = useState("idle");   // idle | loading | success | error
  const [result, setResult]   = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function classify(text) {
    if (!text || text.trim().length < 10) {
      setErrorMsg("Please describe your problem in at least a few words.");
      return;
    }

    setErrorMsg("");
    setResult(null);
    setStatus("loading");

    try {
      const data = await classifyProblem(text);
      setResult(data);
      setStatus("success");
    } catch (e) {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
  }

  return {
    status,
    result,
    errorMsg,
    isLoading: status === "loading",
    classify,
    reset,
  };
}