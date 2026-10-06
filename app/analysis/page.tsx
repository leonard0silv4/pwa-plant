import { Suspense } from "react";
import { SavedAnalysis } from "@/components/history/SavedAnalysis";

export const metadata = { title: "Análise" };

// Static shell (precached by the service worker) that reads the saved analysis
// from IndexedDB, so it also works offline.
export default function AnalysisPage() {
  return (
    <Suspense>
      <SavedAnalysis />
    </Suspense>
  );
}
