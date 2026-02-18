"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";

export interface ReturnRequestItem {
  product_id: number;
  item_id: number;
  quantity: number;
}

export interface ReturnRequest {
  id: number;
  order_id: number;
  customer_id: number;
  type: "replace";
  status: "new" | "processing" | "completed" | "rejected" | "reviewing" | "info_removed";
  reasons?: string;
  details?: string;
  items: ReturnRequestItem[];
  created_at: string;
  updated_at: string;
}

export interface ReturnRequestStatus {
  label: string;
  name: string;
  count: number;
}

export interface ReturnRequestsFilters {
  search?: string;
  status?: string;
  type?: string;
  orderBy?: "id" | "created_at" | "order_id";
}

export interface ReturnRequestsResponse {
  requests: ReturnRequest[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch status filter options for return requests
 */
export async function getReturnRequestStatuses(): Promise<ReturnRequestStatus[]> {
  try {
    return await dokanRequest<ReturnRequestStatus[]>({
      endpoint: "rma/warranty-requests/statuses-filter?_locale=user",
    });
  } catch (error) {
    console.error("Error fetching return request statuses:", error);
    // Return default statuses as fallback
    return [
      { label: "All", name: "all", count: 0 },
      { label: "New", name: "new", count: 0 },
      { label: "Processing", name: "processing", count: 0 },
      { label: "Completed", name: "completed", count: 0 },
      { label: "Rejected", name: "rejected", count: 0 },
      { label: "Reviewing", name: "reviewing", count: 0 },
      { label: "Info Removed", name: "info_removed", count: 0 },
    ];
  }
}

/**
 * Fetch warranty/return requests with filtering and pagination
 */
export async function getReturnRequests(
  page = 1,
  perPage = 10,
  filters: ReturnRequestsFilters = {}
): Promise<ReturnRequestsResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      _locale: "user",
    });

    // Add filters
    if (filters.status && filters.status !== "all") {
      params.append("status", filters.status);
    }

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.type) {
      params.append("type", filters.type);
    }

    if (filters.orderBy) {
      params.append("orderby", filters.orderBy);
    }

    const requests = await dokanRequest<ReturnRequest[]>({
      endpoint: `rma/warranty-requests?${params.toString()}`,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(Math.max(requests.length, 0) / perPage) || 1;

    return {
      requests,
      total: requests.length,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching return requests:", error);
    return {
      requests: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

/**
 * Create a new warranty/return request
 */
export async function createReturnRequest(
  orderId: number,
  customerId: number,
  type: "replace",
  status: string,
  items: ReturnRequestItem[],
  reasons?: string,
  details?: string
): Promise<ReturnRequest | null> {
  try {
    return await dokanRequest<ReturnRequest>({
      endpoint: "rma/warranty-requests",
      method: "POST",
      body: {
        order_id: orderId,
        customer_id: customerId,
        type,
        status,
        reasons,
        details,
        items,
      },
    });
  } catch (error) {
    console.error("Error creating return request:", error);
    return null;
  }
}
