import React from "react";

export default function Step2({ onNext, onBack }) {
  return (
    <div style={{ padding: "20px", border: "1px dashed #ccc", borderRadius: "8px" }}>
      <h3>Step 2: Upload Documents</h3>
      <p style={{ color: "#666" }}>This page is under construction.</p>
      
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button 
          onClick={onBack}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          ← Back
        </button>
        <button 
          onClick={() => onNext([])}
          style={{ padding: "8px 16px", cursor: "pointer", background: "#111", color: "#fff" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}