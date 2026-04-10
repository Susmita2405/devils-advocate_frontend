import { useState } from "react";
import styles from "../../Step2.module.css"; 
// ⚠️ আপনার ফোল্ডার অনুযায়ী ocr.js এর পাথ ঠিক করে নেবেন
import { runOCR } from "../../api/ocr"; 

export default function Step2({ onNext, onBack }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // লোডিং স্টেট

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 🔴 আসল ব্যাকএন্ড কানেকশন এখানে 🔴
  const handleAnalyze = async () => {
    setIsUploading(true);
    try {
      // ব্যাকএন্ডে ফাইল আপলোড হচ্ছে...
      const extractedData = await runOCR(files);
      
      // আপলোড সফল হলে Step 3 তে যাবে
      onNext(files, extractedData); 
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to process documents. Backend ঠিক মতো চলছে কিনা চেক করুন!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.uploadZone} style={{ display: 'block' }}>
        <input 
          type="file" 
          multiple 
          accept="image/*,application/pdf" 
          onChange={handleFileChange} 
          style={{ display: "none" }} 
        />
        <div className={styles.uploadIcon}>📁</div>
        <div className={styles.uploadTitle}>Click to Upload Evidence (Images/PDFs)</div>
        <div className={styles.uploadSub}>Payment receipts, Agreements, WhatsApp Screenshots</div>
      </label>

      {files.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.listTitle}>Attached Evidence:</div>
          {files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
              </div>
              <button 
                type="button"
                className={styles.removeBtn} 
                onClick={(e) => { e.preventDefault(); removeFile(index); }} 
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button 
          type="button"
          className={styles.nextBtn} 
          onClick={handleAnalyze} // <-- এখানে handleAnalyze কল হচ্ছে
          disabled={files.length === 0 || isUploading} 
        >
          {isUploading ? "Uploading & Analyzing..." : "Analyze Case & Extract Evidence"}
        </button>
      </div>
    </div>
  );
}