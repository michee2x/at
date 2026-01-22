"use client";

import { useState } from "react";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import { SellerHeader } from "@/components/dashboard/SellerHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <SellerHeader />

      <div className="flex">
        {/* Desktop Sidebar - fixed position below header (top-16 = 4rem = 64px header height) */}
        <div className="hidden lg:block lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:w-64 lg:z-40 border-r bg-background">
          <SellerSidebar />
        </div>

        {/* Main content - offset by sidebar width */}
        <main className="flex-1 w-full lg:ml-64 bg-slate-50/50 min-h-[calc(100vh-64px)]">
          {/* Page content */}
          <div className="container mx-auto p-4 lg:p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
