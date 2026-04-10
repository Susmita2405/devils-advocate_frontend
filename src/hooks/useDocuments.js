// ─────────────────────────────────────────────
// hooks/useDocuments.js
// Manages document upload + OCR state for Step 2.
// ─────────────────────────────────────────────

import { useState } from "react";
import { runOCR } from "../api/ocr";

export function useDocuments() {
  const [docs, setDocs]       = useState([]);      // { id, name, file, status, extracted }
  const [ocrDone, setOcrDone] = useState(false);
  const [ocrError, setOcrError] = useState("");

  // Add a file to the list (status: "pending")
  function addDocument(file) {
    setDocs((prev) => [
      ...prev,
      {
        id:        crypto.randomUUID(),
        name:      file.name,
        file,
        status:    "pending",   // pending | extracting | done | error
        extracted: null,
      },
    ]);
    setOcrDone(false);
  }

  // Remove one doc
  function removeDocument(id) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setOcrDone(false);
  }

  // Run OCR on all pending docs
  async function extractAll() {
    if (docs.length === 0) return;
    setOcrError("");

    // Mark all as "extracting"
    setDocs((prev) => prev.map((d) => ({ ...d, status: "extracting" })));

    try {
      const updated = await Promise.all(
        docs.map(async (doc) => {
          const text = await runOCR(doc.file);
          return { ...doc, status: "done", extracted: text };
        })
      );
      setDocs(updated);
      setOcrDone(true);
    } catch (e) {
      setOcrError("OCR failed for one or more documents. Please try again.");
      setDocs((prev) => prev.map((d) => ({ ...d, status: "error" })));
    }
  }

  const allDone    = docs.length > 0 && docs.every((d) => d.status === "done");
  const anyPending = docs.some((d) => d.status === "pending");
  const isExtracting = docs.some((d) => d.status === "extracting");

  return {
    docs,
    ocrDone,
    ocrError,
    isExtracting,
    allDone,
    anyPending,
    addDocument,
    removeDocument,
    extractAll,
  };
}