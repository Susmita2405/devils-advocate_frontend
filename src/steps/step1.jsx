import { useState } from "react";
import { useClassify } from "../hooks/useClassify";
import { SAMPLE_PROBLEM_TEXT } from "../constants/mockData";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Tag from "../components/ui/Tag";
import styles from "./Step1.module.css";

export default function Step1({ onNext }) {
  const [text, setText] = useState("");
  const { status, result, errorMsg, isLoading, classify, reset } = useClassify();

  function handleTextChange(e) {
    setText(e.target.value);
    if (result) reset();             
  }

  function handleLoadSample() {
    setText(SAMPLE_PROBLEM_TEXT);
    reset();
  }

  async function handleClassify() {
    await classify(text);
  }

  function handleContinue() {
    onNext(text, result);
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>
        Describe your problem in your own language — Bengali, Hindi, or English.
      </p>

      <textarea
        className={styles.textarea}
        rows={5}
        placeholder='e.g. "ABC Builders আমার কাছ থেকে 3 লাখ টাকা নিয়েছে, flat দেয়নি…"'
        value={text}
        onChange={handleTextChange}
        disabled={isLoading}
      />

      {errorMsg && (
        <p className={styles.error} role="alert">
          {errorMsg}
        </p>
      )}

      <div className={styles.actions}>
        <Button variant="secondary" onClick={handleLoadSample} disabled={isLoading}>
          Load sample
        </Button>
        <Button onClick={handleClassify} disabled={isLoading || text.trim().length < 10}>
          {isLoading ? "Classifying…" : "Classify with AI"}
        </Button>
      </div>

      {status === "success" && result && (
        <Card className={styles.resultCard}>
          <p className={styles.resultLabel}>AI classification result</p>

          <div className={styles.tags}>
            <Tag variant="danger">⚖ {result.type}</Tag>
            <Tag variant="info">🏛 {result.forum}</Tag>
            <Tag variant="success">✓ Confidence: {result.confidence}</Tag>
          </div>

          <p className={styles.resultSummary}>{result.summary}</p>

          <Button fullWidth onClick={handleContinue}>
            Continue →
          </Button>
        </Card>
      )}
    </div>
  );
}