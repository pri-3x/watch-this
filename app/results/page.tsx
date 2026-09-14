import { ResultsView } from "@/components/results/ResultsView";
import { Suspense } from "react";
import { LoadingOracle } from "@/components/results/LoadingOracle";

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingOracle />}>
      <ResultsView />
    </Suspense>
  );
}
