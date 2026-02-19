"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

export type VariationsReportItem = {
  id: number;
  name: string;
  sku?: string;
  items_sold: number;
  net_revenue: number;
  orders_count: number;
};

export type VariationsReportStats = {
  totals: {
    variations_count: number;
    items_sold: number;
    net_revenue: number;
    orders_count: number;
  };
  intervals?: Array<{
    interval: string;
    subtotals?: {
      items_sold?: number;
      net_revenue?: number;
      orders_count?: number;
    };
  }>;
};

async function getWpToken() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");
  const wpToken = (session as any)?.wpToken;
  if (!wpToken) throw new Error("No WP token");
  return wpToken;
}

export async function fetchVariationsReport(
  after?: string,
  before?: string,
  page = 1,
  per_page = 25,
  orderby = "items_sold",
  order = "desc",
): Promise<{ data: VariationsReportItem[]; total: number }> {
  try {
    const wpToken = await getWpToken();
    const params = new URLSearchParams({
      orderby,
      order,
      page: String(page),
      per_page: String(per_page),
      extended_info: "true",
    });
    if (after) params.set("after", after);
    if (before) params.set("before", before);

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/variations?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${wpToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Variations report API error:", await res.text());
      return { data: [], total: 0 };
    }

    const data = await res.json();
    return { data: Array.isArray(data) ? data : [], total: Array.isArray(data) ? data.length : 0 };
  } catch (error) {
    console.error("fetchVariationsReport error:", error);
    return { data: [], total: 0 };
  }
}

export async function fetchVariationsStats(
  after?: string,
  before?: string,
): Promise<VariationsReportStats | null> {
  try {
    const wpToken = await getWpToken();
    const params = new URLSearchParams({
      order: "asc",
      interval: "day",
      per_page: "100",
    });
    if (after) params.set("after", after);
    if (before) params.set("before", before);
    params.append("fields[]", "variations_count");
    params.append("fields[]", "items_sold");
    params.append("fields[]", "net_revenue");
    params.append("fields[]", "orders_count");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/variations/stats?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${wpToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Variations stats API error:", await res.text());
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("fetchVariationsStats error:", error);
    return null;
  }
}
