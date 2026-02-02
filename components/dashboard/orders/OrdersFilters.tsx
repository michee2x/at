"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { OrderFilters } from "@/lib/actions/dashboard/orders";

interface OrdersFiltersProps {
  filters: OrderFilters;
  onFilterChange: (filters: OrderFilters) => void;
  onReset: () => void;
}

const statusTabs = [
  { value: "all", label: "All", count: 0 },
  { value: "pending", label: "Pending payment", count: 0 },
  { value: "processing", label: "Processing", count: 0 },
  { value: "on-hold", label: "On hold", count: 0 },
  { value: "completed", label: "Completed", count: 0 },
  { value: "cancelled", label: "Cancelled", count: 0 },
  { value: "refunded", label: "Refunded", count: 0 },
  { value: "failed", label: "Failed", count: 0 },
];

export function OrdersFilters({ filters, onFilterChange, onReset }: OrdersFiltersProps) {
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

  const handleExportAll = () => {
    console.log("Export all orders");
  };

  const handleExportFiltered = () => {
    console.log("Export filtered orders");
  };

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.dateStart || 
    filters.dateEnd || 
    (filters.status && filters.status !== "all")
  );

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            type="button"
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              currentStatus === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by order number..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Date Filters */}
        <div className="flex gap-2">
          {/* Start Date filter removed as per user request (was redundant/broken) */}
          <Input
            type="date"
            placeholder="End date"
            value={filters.dateEnd || ""}
            onChange={(e) => {
              onFilterChange({ ...filters, dateEnd: e.target.value });
            }}
            className="w-40"
          />
        </div>

        {/* Filter Button (Mobile) */}
        <Button variant="outline" size="icon" className="sm:hidden" type="button">
          <Filter className="h-4 w-4" />
        </Button>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onReset} type="button">
            Reset
          </Button>
        )}
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleExportAll} className="gap-2" type="button">
          <Download className="h-4 w-4" />
          Export All
        </Button>
        <Button onClick={handleExportFiltered} className="gap-2" type="button">
          <Download className="h-4 w-4" />
          Export Filtered
        </Button>
      </div>
    </div>
  );
}
