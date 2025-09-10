// app/variantsdetails/page.tsx (Server Component by default)
import { Suspense } from "react";
import VariantsDetailsPageClient from "./VariantsDetailsPageClient";

export default function VariantsDetailsPageWrapper() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400">Loading page...</p>}>
      <VariantsDetailsPageClient />
    </Suspense>
  );
}
