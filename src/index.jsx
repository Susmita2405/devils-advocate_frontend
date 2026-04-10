// ─────────────────────────────────────────────
// steps/Step2/index.jsx
// "Upload documents" step.
//
// Props:
//   onNext(docs)  — called with extracted docs array
//   onBack()      — go to previous step
// ─────────────────────────────────────────────

import { useRef } from "react";
import { useDocuments } from "../../hooks/useDocuments";
import Button from "../../components/ui/Button";
import Card   from "../../components/ui/Card";
import styles from "./Step2.module.css";

// Sample files the user can add with one click (for demo / testing)
const SAMPLE_FILES = [
  { name: "payment receipt.jpg",    hint: "Receipt" },
  { name: "builder_agreement.pdf",  hint: "Agreement" },
  { name: "whatsapp_screenshot.png",hint: "WhatsApp" },
];

export default function Step2({ onNext, onBack }) {
  const fileInputRef = useRef(null);

  const {
    docs,
    ocrError,
    isExtracting,
    allDone,
    addDocument,
    removeDocument,
    extractAll,
  } = useDocuments();

  // ── Handlers ────────────────────────────────

  // Real file picker
  function handleFileChange(e) {
    Array.from(e.target.files).forEach(addDocument);
    e.target.value = ""; // allow re-selecting same file
  }

  // Add a fake File object for demo purposes
  function handleAddSample(sample) {
    const fakeFile = new File([""], sample.name, { type: "image/jpeg" });
    addDocument(fakeFile);
  }

  // ── Render ──────────────────────────────────
  return (
    <div className={styles.wrapper}>

      <p className={styles.hint}>
        Upload photos of receipts, builder agreements, or screenshots.
        We will extract the text automatically.
      </p>

      {/* Drop zone */}
      <div
        className={styles.dropZone}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          Array.from(e.dataTransfer.files).forEach(addDocument);
        }}
      >
        <span className={styles.dropIcon}>+</span>
        <p className={styles.dropText}>Click or drag files here</p>
        <p className={styles.dropSub}>JPG, PNG, PDF supported</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* Sample buttons */}
      <div className={styles.sampleRow}>
        <span className={styles.sampleLabel}>Add sample:</span>
        {SAMPLE_FILES.map((s) => (
          <button
            key={s.name}
            className={styles.sampleBtn}
            onClick={() => handleAddSample(s)}
            disabled={docs.some((d) => d.name === s.name)}
          >
            + {s.hint}
          </button>
        ))}
      </div>

      {/* Document list */}
      {docs.length > 0 && (
        <div className={styles.docList}>
          {docs.map((doc) => (
            <DocRow
              key={doc.id}
              doc={doc}
              onRemove={() => removeDocument(doc.id)}
            />
          ))}
        </div>
      )}

      {/* OCR error */}
      {ocrError && (
        <p className={styles.error} role="alert">{ocrError}</p>
      )}

      {/* Actions */}
      {docs.length > 0 && (
        <div className={styles.actions}>
          {!allDone && (
            <Button onClick={extractAll} disabled={isExtracting}>
              {isExtracting ? "Extracting text…" : "Run OCR — extract text"}
            </Button>
          )}
          {allDone && (
            <Button onClick={() => onNext(docs)} fullWidth>
              Continue →
            </Button>
          )}
        </div>
      )}

    </div>
  );
}

// ── DocRow sub-component ──────────────────────
function DocRow({ doc, onRemove }) {
  const statusMap = {
    pending:    { label: "Waiting",    cls: "statusPending" },
    extracting: { label: "Extracting…",cls: "statusExtracting" },
    done:       { label: "Done",       cls: "statusDone" },
    error:      { label: "Failed",     cls: "statusError" },
  };

  const { label, cls } = statusMap[doc.status] ?? statusMap.pending;

  return (
    <Card className={styles.docRow}>
      <div className={styles.docMeta}>
        <span className={styles.docIcon}>{fileIcon(doc.name)}</span>
        <div className={styles.docInfo}>
          <p className={styles.docName}>{doc.name}</p>
          {doc.extracted && (
            <p className={styles.docExtracted}>{doc.extracted}</p>
          )}
        </div>
      </div>

      <div className={styles.docRight}>
        <span className={`${styles.status} ${styles[cls]}`}>{label}</span>
        {doc.status !== "extracting" && (
          <button className={styles.removeBtn} onClick={onRemove} title="Remove">✕</button>
        )}
      </div>
    </Card>
  );
}

// ── Helpers ───────────────────────────────────
function fileIcon(name = "") {
  if (name.endsWith(".pdf"))            return "📄";
  if (/\.(png|jpg|jpeg|webp)/.test(name)) return "🖼";
  return "📎";
}