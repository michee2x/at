"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { queryType, useCategory } from "@/contexts/category-context";

export function SidebarSearchParams() {
  const { queryData, setQueryData } = useCategory();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const category = searchParams.get("cat");

  // Set context catId to category id if it changes
  useEffect(() => {
    const catId = category ?? 0;
    const catTitle = title ?? "General";
    const update: queryType = { ...queryData, catId, catTitle };
    setQueryData(update);
  }, [category, title, queryData, setQueryData]);

  return null;
}
