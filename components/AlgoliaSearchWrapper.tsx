"use client";

import dynamic from "next/dynamic";

const AlgoliaSearch = dynamic(() => import("@/components/AlgoliaSearch"), {
  ssr: false,
});

export default function AlgoliaSearchWrapper() {
  return <AlgoliaSearch />;
}
