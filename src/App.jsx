// ─────────────────────────────────────────────
// App.jsx
// Root component. Manages shared state and
// which step is currently visible.
// ─────────────────────────────────────────────

import { useState } from "react";
import { STEPS }    from "./constants/steps"; // Ensure this has 6 or 7 steps defined

import StepNav     from "./components/ui/StepNav";
import ProgressBar from "./components/ui/ProgressBar";
import Step1       from "./steps/step1";
import Step2       from "./steps/Step2";
import Step3       from "./steps/Step3";
import Step4       from "./steps/Step4";
import Step5       from "./steps/Step5"; // <-- Step 5 Import
import Step6       from "./steps/Step6"; // <-- Step 6 Import

import "./styles/globals.css";
import styles from "./App.module.css";

// ── Shared case state ─────────────────────────
const INITIAL_CASE = {
  problemText:    "",    // Step 1
  classification: null,  // Step 1
  documents:      [],    // Step 2
  laws:           [],    // Step 3
  timeline:       [],    // Step 4
  risks:          [],    // Step 5 (Backend Risk Analysis)
  opposition:     [],    // Step 5 (Backend Opposition Agent)
  complaint:      "",    // Step 6 (Backend Generate Complaint)
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData]       = useState(INITIAL_CASE);

  function updateCase(patch) {
    setCaseData((prev) => ({ ...prev, ...patch }));
  }

  // Check if STEPS length is dynamic based on your constants
  const maxSteps = STEPS ? STEPS.length : 6; // Defaulting to 6 for the new dashboard
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, maxSteps));
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
            onNext={(docs, extractedData) => {
              updateCase({ documents: docs, extractedEvidence: extractedData });
              goNext();
            }}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <Step3
            caseData={caseData}
            onNext={(matchedLaws) => {
              updateCase({ laws: matchedLaws });
              goNext();
            }}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <Step4
            caseData={caseData}
            onNext={(generatedTimeline) => {
              updateCase({ timeline: generatedTimeline });
              goNext();
            }}
            onBack={goBack}
          />
        );
      // 🔴 New Step 5: Risk & Opposition
      case 5:
        return (
          <Step5
            caseData={caseData}
            onNext={(analysisData) => {
              updateCase({ 
                risks: analysisData.risks, 
                opposition: analysisData.opposition 
              });
              goNext();
            }}
            onBack={goBack}
          />
        );
      // 🔴 New Step 6: Final Dashboard
      case 6:
        return (
          <Step6 
            caseData={caseData} 
            onBack={goBack} // If you want a back button on the final dashboard
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

  // Safety check for stepMeta
  const stepMeta = STEPS && STEPS[currentStep - 1] 
    ? STEPS[currentStep - 1] 
    : { label: `Step ${currentStep}`, description: "Processing your case..." };

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Nyaya<span>AI</span></h1>
          <span className={styles.stepCount}>Step {currentStep} of {maxSteps}</span>
        </header>

        <ProgressBar currentStep={currentStep} totalSteps={maxSteps} />
        {/* Only show StepNav if you are using it */}
        <StepNav currentStep={currentStep} totalSteps={maxSteps} />

        <div className={styles.stepMeta}>
          <h2 className={styles.stepTitle}>{stepMeta.label}</h2>
          <p className={styles.stepDesc}>{stepMeta.description}</p>
        </div>

        <main>{getActiveStep()}</main>

        {/* Removed the global Back button here, because we handle it inside each step now (except Step 1 and 6 maybe) */}
      </div>
    </div>
  );
}