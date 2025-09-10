 import CategoryDetailsPageClient from "./CategoryDetailsPageClient"
 import { Suspense } from "react";

export default function CategoryDetailsPageWrapper() {
  return (

  <Suspense fallback={<p className="text-center text-gray-400">Loading page...</p>}>
        <CategoryDetailsPageClient />
      </Suspense>
  )
}
