"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

export interface OrdersReportItem {
  order_id: number;
  date: string;
  status: string;
  customer_id?: number;
  total_sales: number;
  net_total?: number;
  num_items_sold?: number;
  extended_info?: any;
  order_number?: number;
}

export interface OrdersReportStats {
  totals: {
    orders_count: number;
    total_customers: number;
    num_items_sold: number;
    coupons_count: number;
    net_revenue: number;
    products: number;
  };
  intervals: Array<{
    interval: string;
    subtotals: any;
  }>;
}

async function getWpToken() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");
  const wpToken = (session as any)?.wpToken;
  if (!wpToken) throw new Error("No WP token");
  return wpToken;
}

export async function fetchOrdersReport(
  after: string,
  before: string,
  page = 1,
  per_page = 25
): Promise<OrdersReportItem[]> {
  try {
    const wpToken = await getWpToken();
    const params = new URLSearchParams({
      orderby: "date",
      order: "desc",
      after,
      before,
      page: String(page),
      per_page: String(per_page),
      extended_info: "true",
      _locale: "user",
    });

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/orders?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${wpToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Orders report API error:", await res.text());
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("fetchOrdersReport error:", error);
    return [];
  }
}

export async function fetchOrdersStats(after: string, before: string): Promise<OrdersReportStats | null> {
  try {
    const wpToken = await getWpToken();
    const params = new URLSearchParams({
      order: "asc",
      interval: "day",
      per_page: "100",
      after,
      before,
      "fields[0]": "orders_count",
      "fields[1]": "total_customers",
      "fields[2]": "products",
      "fields[3]": "num_items_sold",
      "fields[4]": "coupons_count",
      "fields[5]": "net_revenue",
      _locale: "user",
    });

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/orders/stats?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${wpToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Orders stats API error:", await res.text());
      return null;
    }

    const data = await res.json();
    return data as OrdersReportStats;
  } catch (error) {
    console.error("fetchOrdersStats error:", error);
    return null;
  }
}
