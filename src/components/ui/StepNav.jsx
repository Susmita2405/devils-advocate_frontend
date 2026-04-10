// ─────────────────────────────────────────────
// components/ui/StepNav.jsx
// Shows all steps as pills at the top.
// ─────────────────────────────────────────────

import { STEPS } from "../../constants/steps";
import styles from "./StepNav.module.css";

export default function StepNav({ currentStep }) {
  return (
    <nav className={styles.nav} aria-label="Steps">
      {STEPS.map((step) => {
        const isDone   = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <span
            key={step.id}
            className={[
              styles.pill,
              isDone   ? styles.done   : "",
              isActive ? styles.active : "",
              !isDone && !isActive ? styles.idle : "",
            ].join(" ")}
            aria-current={isActive ? "step" : undefined}
          >
            {isDone ? "✓ " : ""}{step.label}
          </span>
        );
      })}
    </nav>
  );
}