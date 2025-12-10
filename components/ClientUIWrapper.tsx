"use client";

import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import MobileFooter from "@/components/mobile-footer";

export default function ClientUIWrapper() {
  return (
    <>
      <FloatingNav />
      <MobileFooter />
    </>
  );
}
