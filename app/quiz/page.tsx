import { QuizFlow } from "@/components/quiz/QuizFlow";
import { Suspense } from "react";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center text-muted">
          Warming up the vibe decoder…
        </div>
      }
    >
      <QuizFlow />
    </Suspense>
  );
}
