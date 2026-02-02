"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  pending: {
    label: "Pending Payment",
    variant: "outline",
    className: "border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-950/20",
  },
  processing: {
    label: "Processing",
    variant: "default",
    className: "bg-blue-500 text-white border-blue-500",
  },
  "on-hold": {
    label: "On Hold",
    variant: "outline",
    className: "border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950/20",
  },
  completed: {
    label: "Completed",
    variant: "default",
    className: "bg-green-500 text-white border-green-500",
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive",
  },
  refunded: {
    label: "Refunded",
    variant: "outline",
    className: "border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-950/20",
  },
  failed: {
    label: "Failed",
    variant: "destructive",
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    variant: "outline" as const,
  };

  return (
    <Badge variant={config.variant} className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
