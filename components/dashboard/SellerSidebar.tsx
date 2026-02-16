"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  BarChart3,
  Clock,
  Star,
  Wallet,
  Users,
  Megaphone,
  MessageSquare,
  Settings,
  ChevronRight,
  UserCog,
  Award,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SubMenu } from "./SubMenu";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  subroutes?: {
    label: string;
    href: string;
  }[];
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    href: "/dashboard/products",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    href: "/dashboard/orders",
  },
  {
    id: "coupons",
    label: "Coupons",
    icon: Tag,
    href: "/dashboard/coupons",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    subroutes: [
      { label: "Products", href: "/dashboard/reports/products" },
      { label: "Revenue", href: "/dashboard/reports/revenue" },
      { label: "Orders", href: "/dashboard/reports/orders" },
      { label: "Variations", href: "/dashboard/reports/variations" },
      { label: "Categories", href: "/dashboard/reports/categories" },
      { label: "Stock", href: "/dashboard/reports/stock" },
      { label: "Statement", href: "/dashboard/reports/statement" },
    ],
  },
  {
    id: "delivery-time",
    label: "Delivery Time",
    icon: Clock,
    href: "/dashboard/delivery-time",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: Star,
    href: "/dashboard/reviews",
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
    href: "/dashboard/shipping",
  },
  {
    id: "withdraw",
    label: "Withdraw",
    icon: Wallet,
    href: "/dashboard/withdraw",
  },
  {
    id: "followers",
    label: "Followers",
    icon: Users,
    href: "/dashboard/followers",
  },
  {
    id: "announcement",
    label: "Announcement",
    icon: Megaphone,
    href: "/dashboard/announcement",
  },
  {
    id: "badge",
    label: "Badge",
    icon: Award,
    href: "/dashboard/badges",
  },
  {
    id: "support",
    label: "Vendor Support",
    icon: MessageSquare,
    href: "/dashboard/support",
  },
  {
    id: "staff",
    label: "Staff",
    icon: UserCog,
    href: "/dashboard/staff",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    subroutes: [
      { label: "Store", href: "/dashboard/settings/store" },
      { label: "Payment", href: "/dashboard/settings/payment" },
      { label: "Verification", href: "/dashboard/settings/verification" },
      { label: "Shipping", href: "/dashboard/settings/shipping" },
      { label: "ShipStation", href: "/dashboard/settings/shipstation" },
      { label: "Social", href: "/dashboard/settings/social" },
      { label: "RMA", href: "/dashboard/settings/rma" },
      { label: "SEO", href: "/dashboard/settings/seo" },
    ],
  },
];

export default function SellerSidebar({
  onLinkClick,
}: {
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isItemActive = (item: NavItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.subroutes) {
      return item.subroutes.some((sub) => pathname === sub.href);
    }
    return false;
  };

  return (
    <aside className="flex flex-col h-full w-64 border-r bg-background">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold tracking-tight">
            Seller Dashboard
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your store
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 overflow-y-auto">
          <nav className="space-y-1 py-4" role="navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item);

              // Item with subroutes
              if (item.subroutes) {
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10 px-3 font-normal",
                        isActive && "bg-secondary font-medium"
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform flex-shrink-0",
                          hoveredItem === item.id && "rotate-90"
                        )}
                      />
                    </Button>

                    {/* Submenu */}
                    <div
                      className={cn(
                        "transition-all duration-200 ease-in-out overflow-hidden",
                        hoveredItem === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <SubMenu
                        isOpen={hoveredItem === item.id}
                        subroutes={item.subroutes}
                        currentPath={pathname}
                        onLinkClick={onLinkClick}
                      />
                    </div>
                  </div>
                );
              }

              // Regular item
              return (
                <Link
                  key={item.id}
                  href={item.href!}
                  prefetch={true}
                  onClick={onLinkClick}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10 px-3 font-normal",
                      isActive && "bg-secondary font-medium"
                    )}
                  >
                    <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <Separator />

        {/* Footer */}
        <div className="p-4">
          <div className="text-xs text-muted-foreground text-center">
            v1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
}
