"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSeed() {
    if (!confirm("This will add 30 quiz questions to Firestore. Continue?")) return;
    setLoading(true);
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setDone(true);
      alert(`✅ Seeded ${data.seeded} quiz questions successfully!`);
    } else {
      alert(`❌ Seed failed: ${data.error}`);
    }
  }

  return (
    <button onClick={handleSeed} disabled={loading || done} className="btn-secondary">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
      {done ? "Questions Seeded ✓" : "Seed Quiz Questions"}
    </button>
  );
}
