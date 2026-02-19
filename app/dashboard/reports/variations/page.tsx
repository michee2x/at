import {
  fetchVariationsReport,
  fetchVariationsStats,
  VariationsReportStats,
} from "@/lib/actions/dashboard/variations-reports";
import { SalesChart } from "@/components/dashboard/SalesChart";
import VariationsFilters from "@/components/dashboard/reports/VariationsFilters";
import { VariationsTable } from "@/components/dashboard/reports/VariationsTable";
import { format, startOfMonth, endOfDay } from "date-fns";

export const revalidate = 60;

function formatRangeDates(start: Date, end: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const toLocal = (d: Date) => {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  return { after: toLocal(start), before: toLocal(end) };
}

export default async function VariationsReportPage({
  searchParams,
}: {
  searchParams?: Record<string, string> | undefined;
}) {
  const params = searchParams || {};
  const start = params?.after
    ? new Date(params.after)
    : startOfMonth(new Date());
  const end = params?.before ? new Date(params.before) : endOfDay(new Date());
  const { after, before } = formatRangeDates(start, end);

  const [variationsRes, stats] = await Promise.all([
    fetchVariationsReport(
      after,
      before,
      params?.page ? Number(params.page) : 1,
      params?.per_page ? Number(params.per_page) : 25,
      params?.orderby ?? "items_sold",
      params?.order ?? "desc",
    ),
    fetchVariationsStats(after, before),
  ]);

  const variations = variationsRes?.data ?? [];

  const chartData = (stats?.intervals || []).map((it) => ({
    date: it.interval,
    current: it.subtotals?.items_sold ?? 0,
    previous: 0,
  }));

  const totals = stats?.totals ?? {
    variations_count: 0,
    items_sold: 0,
    net_revenue: 0,
    orders_count: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Variations Report</h1>
        <p className="text-muted-foreground mt-2">
          Analyze variation-level sales and performance.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <VariationsFilters />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Items Sold</p>
          <p className="text-2xl font-bold mt-2">{totals.items_sold}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Net Revenue</p>
          <p className="text-2xl font-bold mt-2">
            ₦{(totals.net_revenue ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-2xl font-bold mt-2">{totals.orders_count}</p>
        </div>
      </div>

      <SalesChart
        data={chartData}
        title={`Items Sold (${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")})`}
      />

      <VariationsTable
        variations={variations}
        totals={{
          items_sold: totals.items_sold,
          net_revenue: totals.net_revenue,
          orders_count: totals.orders_count,
        }}
      />
    </div>
  );
}
