// ─────────────────────────────────────────────
// api/ocr.js
// OCR logic in one place.
// Currently mocked — swap USE_MOCK to false and
// wire in real Tesseract.js when ready.
// ─────────────────────────────────────────────

const USE_MOCK = true;

// Map of sample file names → mock extracted text.
// Extend this as you add more test documents.
const MOCK_RESULTS = {
  "payment receipt.jpg":    "₹3,00,000 received. Date: January 15, 2022. Ref: TXN-0042.",
  "builder_agreement.pdf":  "Flat B-204. Delivery deadline: December 2023. Builder: ABC Builders Pvt. Ltd.",
  "whatsapp_screenshot.png":"Builder replied: 'Will update you soon.' Date: March 12, 2024.",
};

const MOCK_FALLBACK = "Text extracted successfully from document.";

// ── Main export ───────────────────────────────
// file: a File object from <input type="file">
// Returns: extracted text string
export async function runOCR(file) {
  if (USE_MOCK) {
    await delay(800 + Math.random() * 600); // simulate per-file latency
    const key = file.name.toLowerCase();
    return MOCK_RESULTS[key] ?? MOCK_FALLBACK;
  }

  // ── Real Tesseract.js (uncomment when ready) ──
  // import Tesseract from "tesseract.js";
  // const { data } = await Tesseract.recognize(file, "eng+ben", {
  //   logger: (m) => console.log(m),
  // });
  // return data.text;
}

// ── Internal ──────────────────────────────────
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}