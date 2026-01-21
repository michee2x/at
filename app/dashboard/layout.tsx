"use client";

import { useState } from "react";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - hidden on mobile, fixed on desktop */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:w-64 lg:z-30">
        <SellerSidebar />
      </div>

      {/* Mobile Sheet Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SellerSidebar onLinkClick={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 w-full lg:ml-64">
        {/* Mobile header with hamburger */}
        <div className="lg:hidden sticky top-0 z-40 border-b bg-background">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Seller Dashboard</h1>
          </div>
        </div>

        {/* Page content */}
        <div className="container mx-auto p-4 lg:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
