"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => null,
});

export default function SidebarWrapper() {
  return <Sidebar />;
}
