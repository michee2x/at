"use client";

import { cn } from "@/lib/utils";

interface ReturnStatusBadgeProps {
  status:
    | "new"
    | "processing"
    | "completed"
    | "rejected"
    | "reviewing"
    | "info_removed"
    | "all";
  className?: string;
}

const statusConfig = {
  new: {
    label: "New",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  processing: {
    label: "Processing",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  reviewing: {
    label: "Reviewing",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  info_removed: {
    label: "Info Removed",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
  all: {
    label: "All",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
};

export function ReturnStatusBadge({
  status,
  className,
}: ReturnStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.all;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
