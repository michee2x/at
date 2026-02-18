"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReturnRequestsFilters } from "@/components/dashboard/return-requests/ReturnRequestsFilters";
import { ReturnRequestsTable } from "@/components/dashboard/return-requests/ReturnRequestsTable";
import { ReturnRequestsPagination } from "@/components/dashboard/return-requests/ReturnRequestsPagination";
import { ReturnRequestsTableSkeleton } from "@/components/dashboard/return-requests/ReturnRequestsTableSkeleton";
import { EmptyReturnRequestsState } from "@/components/dashboard/return-requests/EmptyReturnRequestsState";
import {
  getReturnRequests,
  getReturnRequestStatuses,
  type ReturnRequest,
  type ReturnRequestStatus,
} from "@/lib/actions/dashboard/return-requests";

interface FilterState {
  search?: string;
  status?: string;
  type?: string;
  orderBy?: "id" | "created_at" | "order_id";
}

export default function ReturnRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialFilters: FilterState = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
  };

  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [statuses, setStatuses] = useState<ReturnRequestStatus[]>([]);

  // Fetch statuses on mount
  useEffect(() => {
    const fetchStatuses = async () => {
      const data = await getReturnRequestStatuses();
      setStatuses(data);
    };
    fetchStatuses();
  }, []);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getReturnRequests(currentPage, 10, filters);
      setRequests(response.requests);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch return requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);

    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.status && newFilters.status !== "all") {
      params.set("status", newFilters.status);
    }
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL params
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }
    params.set("page", page.toString());

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({ search: "", status: "all" });
    setCurrentPage(1);
    router.push("?");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Return Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all your return and warranty requests
        </p>
      </div>

      {/* Filters */}
      <ReturnRequestsFilters
        filters={filters}
        statuses={statuses}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Content */}
      {isLoading ? (
        <ReturnRequestsTableSkeleton />
      ) : requests.length === 0 ? (
        <EmptyReturnRequestsState />
      ) : (
        <>
          <ReturnRequestsTable requests={requests} />
          {totalPages > 1 && (
            <ReturnRequestsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
}
