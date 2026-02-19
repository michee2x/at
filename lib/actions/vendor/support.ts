"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";

const ENDPOINT_BASE = "vendor/support-tickets";

export interface VendorSupportStats {
  open: number;
  closed: number;
  total: number;
}

export interface VendorSupportTicket {
  id: number;
  ticket_id?: string;
  subject?: string;
  message?: string;
  status?: string;
  priority?: string;
  created_at?: string;
  updated_at?: string;
  customer_id?: number;
  customer_name?: string;
  customer_email?: string;
}

export interface VendorSupportFilters {
  page?: number;
  per_page?: number;
  status?: string;
  customer_id?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export async function getVendorSupportStats(): Promise<VendorSupportStats> {
  try {
    const data = await dokanRequest<{ open?: number; closed?: number; total?: number }>({
      endpoint: `${ENDPOINT_BASE}/stats?_locale=user`,
    });

    return {
      open: Number(data?.open ?? 0),
      closed: Number(data?.closed ?? 0),
      total: Number(data?.total ?? 0),
    };
  } catch (error) {
    console.error("getVendorSupportStats error:", error);
    return { open: 0, closed: 0, total: 0 };
  }
}

export async function getVendorSupportTickets(filters: VendorSupportFilters = {}): Promise<VendorSupportTicket[]> {
  try {
    const params = new URLSearchParams();
    params.set("page", (filters.page ?? 1).toString());
    params.set("per_page", (filters.per_page ?? 10).toString());
    params.set("_locale", "user");

    if (filters.status) params.set("status", filters.status);
    if (typeof filters.customer_id !== "undefined") params.set("customer_id", String(filters.customer_id));
    if (filters.start_date) params.set("start_date", filters.start_date);
    if (filters.end_date) params.set("end_date", filters.end_date);
    if (filters.search) params.set("search", filters.search);

    const data = await dokanRequest({ endpoint: `${ENDPOINT_BASE}?${params.toString()}` });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("getVendorSupportTickets error:", error);
    return [];
  }
}
