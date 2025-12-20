"use client";

import { useFilter } from "@/contexts/filter-context";
import { Button } from "@/components/ui/button";
import { Sliders } from "lucide-react";
import { useCallback } from "react";

export default function FilterToggle() {
  const { showFilter, setShowFilter } = useFilter();

  const onClick = useCallback(() => {
    // On desktop, scroll to the sidebar; on small screens toggle the overlay
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      const el = document.getElementById("filter-sidebar");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setShowFilter((s) => !s);
  }, [setShowFilter]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="inline-flex items-center gap-2"
      aria-pressed={showFilter}
      aria-label="Open filters"
    >
      <Sliders className="h-4 w-4" />
      <span>Filters</span>
    </Button>
  );
}
