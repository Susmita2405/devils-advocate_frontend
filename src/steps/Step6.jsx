import { useState, useEffect } from "react";
import styles from "./Step6.module.css";
import { generateComplaint } from "../api/claude";

export default function Step6({ caseData }) {
  const [loading, setLoading] = useState(true);
  const [complaintText, setComplaintText] = useState("");
  
  // ব্যাকএন্ডের Risk Analysis থেকে আসা আসল জেতার সম্ভাবনা
  const winProbability = caseData.risks?.probabilityOfSuccess || "Evaluating...";

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        // ব্যাকএন্ডের রিয়েল API কল
        const result = await generateComplaint(caseData);
        setComplaintText(result.complaint);
      } catch (error) {
        console.error("Failed to generate complaint:", error);
        setComplaintText("Error: Failed to generate document from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [caseData]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <h3 className={styles.loadingTitle}>Drafting Final Legal Document...</h3>
        <p className={styles.loadingSub}>Applying correct Indian court formatting from backend.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* ─── Left Panel: Document (Real Backend Data) ─── */}
      <div className={styles.documentPanel}>
        <div className={styles.panelHeader}>
          <h3>📄 Final Legal Complaint</h3>
          <button className={styles.downloadBtn}>⬇ Download PDF</button>
        </div>
        <div className={styles.documentBody}>
          <pre className={styles.docText}>{complaintText}</pre>
        </div>
      </div>

      {/* ─── Right Panel: Analytics & Strategy ─── */}
      <div className={styles.analyticsPanel}>
        <h3 className={styles.panelTitle}>📊 Case Analytics & Strategy</h3>
        
        {/* 1. Real Win Probability from Backend */}
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Estimated Success Rate</div>
          <div className={styles.progressContainer}>
            {/* যদি ব্যাকএন্ড '75%' পাঠায়, সেটাকে width এ বসানোর লজিক */}
            <div 
              className={styles.progressBar} 
              style={{ width: winProbability.replace(/[^0-9]/g, '') + "%" || "50%" }}
            ></div>
          </div>
          <div className={styles.statValueRow}>
            <span className={styles.statValueWin}>{winProbability}</span>
            <span className={styles.statSub}>Based on AI Risk Analysis</span>
          </div>
        </div>

        {/* 2. Value Proposition / Time / Cost Comparison */}
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Why NyayaAI?</div>
          <div className={styles.costGrid}>
            <div className={styles.costCol}>
              <span className={styles.costTitle}>Lawyer Fee</span>
              <span className={styles.costBad}>₹25K - ₹50K</span>
            </div>
            <div className={styles.vsBadge}>VS</div>
            <div className={styles.costCol} style={{ textAlign: "right" }}>
              <span className={styles.costTitle}>NyayaAI</span>
              <span className={styles.costGood}>₹0 (Free)</span>
            </div>
          </div>
          <div style={{marginTop: "12px", fontSize: "12px", color: "var(--color-text-secondary)"}}>
            This drafted document saves you weeks of lawyer consultation time.
          </div>
        </div>

        {/* 3. Real Rebuttals from Backend */}
        <div className={styles.oppositionBox}>
          <div className={styles.oppHeader}>
            <span className={styles.oppIcon}>🛡️</span>
            <h4>Suggested Rebuttals</h4>
          </div>
          <p className={styles.oppDesc}>How to counter their attacks in court:</p>
          
          <ul className={styles.oppList}>
            {caseData.opposition?.suggestedRebuttals?.slice(0, 2).map((reb, i) => (
              <li key={i}>
                <div className={styles.oppArgue}><strong>They Say:</strong> {reb.oppositionArgument}</div>
                <div className={styles.oppCounter}><strong>You Say:</strong> {reb.rebuttal}</div>
                {reb.supportingEvidence && (
                  <div style={{fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px"}}>
                    <em>Evidence needed: {reb.supportingEvidence}</em>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}