// ─────────────────────────────────────────────
// api/ocr.js (Fully Synced with Real Backend)
// ─────────────────────────────────────────────

// যেহেতু একাধিক ফাইল সিলেক্ট করা যেতে পারে, তাই array নিচ্ছি
export async function runOCR(filesArray) {
  const formData = new FormData();
  
  // ব্যাকএন্ড ফিল্ড নেম "files" চাইছে। 
  // যতো গুলো ফাইল সিলেক্ট করা হয়েছে সবগুলোকে "files" নামে অ্যাপেন্ড করছি
  filesArray.forEach((file) => {
    formData.append("files", file); 
  });

  try {
    const response = await fetch("/api/upload-evidence", {
      method: "POST",
      // দ্রষ্টব্য: FormData পাঠালে headers এ Content-Type দেওয়া লাগে না
      body: formData, 
    });

    if (!response.ok) throw new Error("OCR Upload failed");
    
    // আপনার ব্যাকএন্ড যেমন ডাটা রিটার্ন করবে (ধরে নিচ্ছি evidence array)
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}