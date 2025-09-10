import { Suspense } from "react";
import ProblemDetailPageClient from "../../ProblemDetailPageClient";

export default function Page({ params }) {
  const { category, problem } = params;

  return (
    <Suspense fallback={<p className="text-center text-gray-400">Loading problem details...</p>}>
      <ProblemDetailPageClient category={category} problem={problem} />
    </Suspense>
  );
}
