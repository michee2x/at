"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  FileText,
  Download,
  MapPin,
  RotateCcw,
  CreditCard,
  User,
  Store,
  HelpCircle,
  LogOut,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/my-account",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    href: "/my-account/order",
  },
  {
    id: "quotes",
    label: "Request Quotes",
    icon: FileText,
    href: "/my-account/quotes",
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: Download,
    href: "/my-account/downloads",
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: MapPin,
    href: "/my-account/addresses",
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    icon: RotateCcw,
    href: "/my-account/returns",
  },
  {
    id: "payment",
    label: "Payment methods",
    icon: CreditCard,
    href: "/my-account/payment",
  },
  {
    id: "account",
    label: "Account details",
    icon: User,
    href: "/my-account/edit-account",
  },
  { id: "vendors", label: "Vendors", icon: Store, href: "/my-account/vendors" },
  {
    id: "support",
    label: "Seller Support",
    icon: HelpCircle,
    href: "/my-account/support-tickets",
  },
];

export default function DashboardSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { resetOnLogout } = useCart();

  return (
    // Always render content so it can be used inside the mobile sheet.
    // Visibility on desktop/mobile is controlled by the parent layout.
    <aside className="flex flex-col h-full w-80 border-r bg-muted/30 lg:fixed lg:inset-y-0 lg:top-16">
      <div className="flex flex-col h-full">
        <div className="p-4 lg:p-6 mb-1">
          <h2 className="text-xl font-bold tracking-tight">Account</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your account
          </p>
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-3 lg:px-4">
          <nav
            className="space-y-1 py-4"
            role="navigation"
            aria-label="Dashboard navigation"
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.id} href={item.href} prefetch={true} onClick={onLinkClick}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left h-auto py-3 px-4 ${
                      isActive ? "bg-secondary font-medium" : "hover:bg-accent"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className="mr-3 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <ChevronRight
                        className="h-4 w-4 ml-2"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <Separator />

        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              resetOnLogout(); // Clear cart before signing out
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
