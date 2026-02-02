"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrdersFilters } from "@/components/dashboard/orders/OrdersFilters";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { OrdersPagination } from "@/components/dashboard/orders/OrdersPagination";
import { OrdersTableSkeleton } from "@/components/dashboard/orders/OrdersTableSkeleton";
import { EmptyOrdersState } from "@/components/dashboard/orders/EmptyOrdersState";
import { getVendorOrders, OrderFilters } from "@/lib/actions/dashboard/orders";
import { VendorOrderDisplay } from "@/lib/user/types";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialFilters: OrderFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    dateStart: searchParams.get("dateStart") || "",
    dateEnd: searchParams.get("dateEnd") || "",
  };

  const [orders, setOrders] = useState<VendorOrderDisplay[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getVendorOrders(currentPage, 10, filters);
      setOrders(response.orders);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Sync state to URL (optional, for sharing/refresh)
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.dateStart) params.set("dateStart", filters.dateStart);
    if (filters.dateEnd) params.set("dateEnd", filters.dateEnd);

    const queryString = params.toString();
    const url = queryString ? `/dashboard/orders?${queryString}` : "/dashboard/orders";
    
    // Use replace to update URL without adding to history stack for every keystroke
    router.replace(url, { scroll: false });
  }, [currentPage, filters, router]);

  const handleFilterChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleReset = () => {
    setFilters({ status: "all", search: "", dateStart: "", dateEnd: "" });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasFilters = Boolean(
    filters.search || 
    filters.dateStart || 
    filters.dateEnd || 
    (filters.status && filters.status !== "all")
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and manage orders for your products.
        </p>
      </div>

      {/* Filters */}
      <OrdersFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={handleReset}
      />

      {/* Orders Table */}
      {isLoading ? (
        <OrdersTableSkeleton />
      ) : orders.length === 0 ? (
        <EmptyOrdersState hasFilters={hasFilters} />
      ) : (
        <div className="space-y-0">
          <OrdersTable orders={orders} />
          <OrdersPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Order Count */}
      {!isLoading && orders.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
          {total > orders.length && ` of ${total} total`}
        </p>
      )}
    </div>
  );
}
