// ─────────────────────────────────────────────
// components/ui/Button.jsx
// ─────────────────────────────────────────────

import styles from "./Button.module.css";

// variant: "primary" | "secondary"
export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        styles.btn,
        styles[variant],
        fullWidth ? styles.fullWidth : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}