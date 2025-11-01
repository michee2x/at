"use client"

import React from "react";
import dynamic from "next/dynamic";
import { WooProduct } from "@/types";
import { ProductSuggestionSkeleton } from "@/app/product/[id]/page";

const SuggestionCard = dynamic(
  () => import("@/components/productdetails/suggestionCard"),
  { ssr: false }
);

const SuggestionCardWrapper = ({
  suggestions,
}: {
  suggestions: WooProduct[];
}) => {
  return <SuggestionCard suggestions={suggestions} />;
};

export default SuggestionCardWrapper;
