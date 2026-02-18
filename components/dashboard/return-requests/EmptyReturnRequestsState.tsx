"use client";

import { Package } from "lucide-react";

export function EmptyReturnRequestsState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 rounded-lg border border-dashed bg-muted/30 py-12 px-4">
      <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold text-foreground">
        No return requests found
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        You don't have any return requests at this time.
      </p>
    </div>
  );
}
