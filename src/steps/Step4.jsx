import { useState } from "react";
import styles from "./Step4.module.css";

export default function Step4({ caseData, onNext, onBack }) {
  // Step 1 ba Step 3 theke asha data theke summary extract korchi
  const summary = caseData.problemText || "Case summary is being processed...";

  // Jodi backend theke timeline na ashe, tobe ekta automatic timeline toiri hobe
  const timeline = caseData.timeline && caseData.timeline.length > 0 
    ? caseData.timeline 
    : [
        { date: "Initial Event", event: "Incident occurred as per the complainant's statement." },
        { date: "Current Status", event: "Legal complaint drafting initiated via NyayaAI." }
      ];

      

  return (
    <div className={styles.wrapper}>
      
      {/* Case Summary Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>📄</span>
          <h3>Case Summary</h3>
        </div>
        <p className={styles.summaryText}>{summary}</p>
      </div>

      {/* Timeline Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>⏱️</span>
          <h3>Chronological Timeline</h3>
        </div>
        <div className={styles.timeline}>
          {timeline.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.date}>{item.date || "Date"}</div>
              <div className={styles.event}>{item.event || item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.nextBtn} onClick={() => onNext(timeline)}>
          Proceed to Risk Analysis (API Call) →
        </button>
      </div>
    </div>
  );
}