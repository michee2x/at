"use client";

import { Announcement } from "@/lib/actions/dashboard/announcement";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AnnouncementBadgeProps {
  status: Announcement['read_status'];
  className?: string;
}

export default function AnnouncementBadge({ status, className }: AnnouncementBadgeProps) {
  const variants = {
    read: {
      label: "Read",
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },
    unread: {
      label: "Unread",
      className: "bg-blue-100 text-blue-700 border-blue-300",
    },
    trash: {
      label: "Trash",
      className: "bg-red-100 text-red-700 border-red-300",
    },
  };

  const variant = variants[status] || variants.unread;

  return (
    <Badge 
      variant="outline" 
      className={cn(variant.className, className)}
    >
      {variant.label}
    </Badge>
  );
}
