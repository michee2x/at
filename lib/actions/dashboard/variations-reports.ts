import { dokanRequest } from "@/lib/dashboard/dokan";

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

export async function fetchVariationsReport(
  after?: string,
  before?: string,
  page = 1,
  per_page = 25,
  orderby = "items_sold",
  order = "desc",
): Promise<{ data: VariationsReportItem[]; total: number }> {
  const params = new URLSearchParams({
    orderby,
    order,
    page: String(page),
    per_page: String(per_page),
    extended_info: "true",
  });
  if (after) params.set("after", after);
  if (before) params.set("before", before);

  const endpoint = `/wp-json/wc-analytics/reports/variations?${params.toString()}`;
  const res = await dokanRequest<VariationsReportItem[]>({
    endpoint,
    method: "GET",
  });
  
  return { data: res, total: res.length };
}

export async function fetchVariationsStats(
  after?: string,
  before?: string,
): Promise<VariationsReportStats | null> {
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

  const endpoint = `/wp-json/wc-analytics/reports/variations/stats?${params.toString()}`;
  const res = await dokanRequest<VariationsReportStats>({
    endpoint,
    method: "GET",
  });
  return res;
}
