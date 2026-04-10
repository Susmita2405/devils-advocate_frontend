// ─────────────────────────────────────────────
// components/ui/Tag.jsx
// ─────────────────────────────────────────────

import styles from "./Tag.module.css";

// variant: "danger" | "info" | "success" | "warn" | "neutral"
export default function Tag({ children, variant = "neutral" }) {
  return (
    <span className={[styles.tag, styles[variant]].join(" ")}>
      {children}
    </span>
  );
}