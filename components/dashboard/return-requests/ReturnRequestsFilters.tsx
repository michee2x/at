"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ReturnRequestStatus } from "@/lib/actions/dashboard/return-requests";

interface FilterState {
  search?: string;
  status?: string;
  type?: string;
  orderBy?: "id" | "created_at" | "order_id";
}

interface ReturnRequestsFiltersProps {
  filters: FilterState;
  statuses: ReturnRequestStatus[];
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ReturnRequestsFilters({
  filters,
  statuses,
  onFilterChange,
  onReset,
  isLoading = false,
}: ReturnRequestsFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const currentStatus = filters.status || "all";

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ ...filters, search: searchValue });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onFilterChange]);

  // Sync internal state with props
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };

  const hasActiveFilters = Boolean(
    filters.search || (filters.status && filters.status !== "all"),
  );

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statuses.map((status) => (
          <button
            key={status.name}
            onClick={() => handleStatusChange(status.name)}
            disabled={isLoading}
            type="button"
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50",
              currentStatus === status.name
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {status.label}
            {status.count > 0 && (
              <span className="ml-1 text-xs opacity-75">({status.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order ID, product..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={isLoading}
            className="pl-10"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              type="button"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
