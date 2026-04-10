// ─────────────────────────────────────────────
// components/ui/ProgressBar.jsx
// ─────────────────────────────────────────────

import { TOTAL_STEPS } from "../../constants/steps";
import styles from "./ProgressBar.module.css";

export default function ProgressBar({ currentStep }) {
  const pct = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className={styles.track} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}