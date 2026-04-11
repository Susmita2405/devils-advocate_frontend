import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Tag from "../components/ui/Tag";
import styles from "./Step3.module.css";

export default function Step3({ onNext, onBack }) {
  const [loading, setLoading] = useState(true);

  // Simulate AI searching the legal database (RAG System)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds delay for realistic AI feel
    return () => clearTimeout(timer);
  }, []);

  // Mock data based on your "Ramesh Da" example
  const matchedLaws = [
    {
      id: 1,
      act: "RERA Act, 2016",
      section: "Section 18",
      description: "If a builder fails to complete or is unable to give possession of an apartment by the date specified, they are liable to return the entire amount with interest.",
      match: "High Match",
      tagType: "success"
    },
    {
      id: 2,
      act: "Consumer Protection Act, 2019",
      section: "Section 35",
      description: "Allows consumers to file a complaint for deficiency in services. Failure to deliver a flat on time constitutes a severe deficiency in service.",
      match: "High Match",
      tagType: "success"
    },
    {
      id: 3,
      act: "Indian Penal Code (IPC)",
      section: "Section 420",
      description: "Cheating and dishonestly inducing delivery of property. Applicable if it can be proven the builder had fraudulent intent from the beginning.",
      match: "Medium Match",
      tagType: "warn"
    }
  ];

  

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <h3 className={styles.loadingTitle}>Querying Indian Legal Database...</h3>
        <p className={styles.loadingSub}>Analyzing documents and finding relevant acts & sections via RAG.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconBox}>⚖️</div>
        <div>
          <h3 className={styles.title}>Relevant Laws Found</h3>
          <p className={styles.subtitle}>Our system identified the following legal grounds for your complaint.</p>
        </div>
      </div>

      <div className={styles.lawList}>
        {matchedLaws.map((law) => (
          <Card key={law.id} className={styles.lawCard}>
            <div className={styles.lawHeader}>
              <h4 className={styles.lawAct}>{law.act}</h4>
              <Tag variant={law.tagType}>{law.match}</Tag>
            </div>
            <div className={styles.lawSection}>Applicable: <span>{law.section}</span></div>
            <p className={styles.lawDesc}>{law.description}</p>
          </Card>
        ))}
      </div>

      <div className={styles.actions}>
        <Button onClick={() => onNext(matchedLaws)} fullWidth>
          Proceed to Case Summary →
        </Button>
      </div>
    </div>
  );
}