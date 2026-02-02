import { Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyOrdersStateProps {
  hasFilters: boolean;
}

export function EmptyOrdersState({ hasFilters }: EmptyOrdersStateProps) {
  if (hasFilters) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No orders found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          No orders match your current filters. Try adjusting your search criteria.
        </p>
        <Button variant="outline" onClick={() => window.location.href = "/dashboard/orders"}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No orders yet</h3>
      <p className="text-sm text-muted-foreground">
        You haven't received any orders yet. Orders will appear here once customers purchase your products.
      </p>
    </div>
  );
}
