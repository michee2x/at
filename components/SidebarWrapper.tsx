"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => null,
});

export default function SidebarWrapper() {
  return (
    <Suspense fallback={null}>
      <Sidebar />
    </Suspense>
  );
}
