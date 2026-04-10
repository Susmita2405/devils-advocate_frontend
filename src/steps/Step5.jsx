import { useState, useEffect } from "react";
import styles from "./Step5.module.css";
// আপনার claude.js ফাইলের পাথ ঠিক করে নেবেন
import { analyzeRisks, getOppositionArguments } from "../api/claude"; 

export default function Step5({ caseData, onNext, onBack }) {
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState(null);
  const [oppData, setOppData] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // ব্যাকএন্ডের দুটি API একসাথে কল করা হচ্ছে
        const [riskResult, oppResult] = await Promise.all([
          analyzeRisks(caseData),
          getOppositionArguments(caseData)
        ]);
        
        setRiskData(riskResult);
        setOppData(oppResult);
      } catch (error) {
        console.error("Error fetching analysis from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [caseData]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <h3 className={styles.loadingTitle}>Analyzing Risks & Opponent Strategy...</h3>
        <p className={styles.loadingSub}>Communicating with NyayaAI Backend (Port 8000)</p>
      </div>
    );
  }

  // যদি ব্যাকএন্ড থেকে ডেটা না আসে
  if (!riskData || !oppData) {
    return <div style={{color:"red"}}>Failed to load data from backend. Check network tab.</div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* ─── Risk Analysis ─── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>⚠️ Case Weaknesses & Risks</h3>
        <p className={styles.desc}>Overall Risk Level: <strong>{riskData.overallRiskLevel?.toUpperCase()}</strong></p>
        <ul className={styles.list}>
          {riskData.weakPoints?.map((wp, i) => (
            <li key={i}>
              <strong>{wp.issue}</strong> - {wp.explanation}
              <div style={{color: "var(--color-success-text)", marginTop: "4px"}}>
                <em>Fix: {wp.mitigation}</em>
              </div>
            </li>
          ))}
          {riskData.missingEvidence?.length > 0 && (
            <li style={{color: "var(--color-danger-text)"}}>
              <strong>Missing Evidence:</strong> {riskData.missingEvidence.map(m => m.item).join(", ")}
            </li>
          )}
        </ul>
      </div>

      {/* ─── Opposition Agent ─── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>🛡️ Opposition Arguments</h3>
        <p className={styles.desc}>Strategy: {oppData.oppositionStrategy}</p>
        <ul className={styles.list}>
          {oppData.counterArguments?.map((arg, i) => (
            <li key={i}>
              <div style={{color: "var(--color-danger-text)"}}>
                <strong>Opponent will argue:</strong> {arg.argument}
              </div>
              <div style={{color: "var(--color-success-text)", marginTop: "4px"}}>
                <strong>Basis:</strong> {arg.legalBasis}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Next বাটনে ক্লিক করলে রিয়েল ডেটা Step 6 এ পাঠানো হবে */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <button 
          className={styles.nextBtn} 
          onClick={() => onNext({ risks: riskData, opposition: oppData })}
        >
          Generate Final Complaint →
        </button>
      </div>
    </div>
  );
}