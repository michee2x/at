"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SubMenuProps {
  isOpen: boolean;
  subroutes: {
    label: string;
    href: string;
  }[];
  currentPath: string;
  onLinkClick?: () => void;
}

export function SubMenu({
  isOpen,
  subroutes,
  currentPath,
  onLinkClick,
}: SubMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="py-1 pl-9 space-y-0.5">
      {subroutes.map((route) => {
        const isActive = currentPath === route.href;

        return (
          <Link
            key={route.href}
            href={route.href}
            onClick={onLinkClick}
            className={cn(
              "block px-3 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-secondary text-secondary-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </div>
  );
}
