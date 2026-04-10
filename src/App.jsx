// ─────────────────────────────────────────────
// App.jsx
// Root component. Manages shared state and
// which step is currently visible.
//
// To add a new step:
//   1. Create src/steps/StepN/index.jsx
//   2. Add its metadata to src/constants/steps.js
//   3. Import it here and add to getActiveStep()
// ─────────────────────────────────────────────

import { useState } from "react";
import { STEPS }    from "./constants/steps";

import StepNav     from "./components/ui/StepNav";
import ProgressBar from "./components/ui/ProgressBar";
import Step1       from "./steps/step1";
import Step2       from "./steps/Step2";
// import Step3    from "./steps/Step3";   ← uncomment as you build

import "./styles/globals.css";
import styles from "./App.module.css";

// ── Shared case state ─────────────────────────
const INITIAL_CASE = {
  problemText:    "",    // Step 1
  classification: null,  // Step 1
  documents:      [],    // Step 2
  laws:           [],    // Step 3
  timeline:       [],    // Step 4
  risks:          [],    // Step 5
  opposition:     [],    // Step 6
  complaint:      "",    // Step 7
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData]       = useState(INITIAL_CASE);

  function updateCase(patch) {
    setCaseData((prev) => ({ ...prev, ...patch }));
  }

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  function getActiveStep() {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            onNext={(text, result) => {
              updateCase({ problemText: text, classification: result });
              goNext();
            }}
          />
        );
      case 2:
        return (
          <Step2
            onNext={(docs) => {
              updateCase({ documents: docs });
              goNext();
            }}
            onBack={goBack}
          />
        );
      default:
        return (
          <div className={styles.comingSoon}>
            <p>Step {currentStep} is coming soon.</p>
          </div>
        );
    }
  }

  const stepMeta = STEPS[currentStep - 1];

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>NyayaAI</h1>
          <span className={styles.stepCount}>Step {currentStep} of {STEPS.length}</span>
        </header>

        <ProgressBar currentStep={currentStep} />
        <StepNav currentStep={currentStep} />

        <div className={styles.stepMeta}>
          <h2 className={styles.stepTitle}>{stepMeta.label}</h2>
          <p className={styles.stepDesc}>{stepMeta.description}</p>
        </div>

        <main>{getActiveStep()}</main>

        {currentStep > 1 && (
          <button className={styles.backBtn} onClick={goBack}>← Back</button>
        )}
      </div>
    </div>
  );
}