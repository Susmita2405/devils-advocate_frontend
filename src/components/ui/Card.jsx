// ─────────────────────────────────────────────
// components/ui/Card.jsx
// ─────────────────────────────────────────────

import styles from "./Card.module.css";

export default function Card({ children, className = "" }) {
  return (
    <div className={[styles.card, className].join(" ")}>
      {children}
    </div>
  );
}