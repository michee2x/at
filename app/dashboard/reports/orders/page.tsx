import {
  fetchOrdersReport,
  fetchOrdersStats,
  OrdersReportStats,
} from "@/lib/actions/dashboard/orders-reports";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { OrdersTable } from "@/components/dashboard/reports/OrdersTable";
import { format, startOfMonth, endOfDay } from "date-fns";

export const revalidate = 60;

function formatRangeDates(start: Date, end: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const toLocal = (d: Date) => {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  return { after: toLocal(start), before: toLocal(end) };
}

export default async function OrdersReportPage({
  searchParams,
}: {
  searchParams?: Record<string, string> | undefined;
}) {
  const params = (searchParams as Record<string, string>) || {};
  const start = params?.after
    ? new Date(params.after)
    : startOfMonth(new Date());
  const end = params?.before ? new Date(params.before) : endOfDay(new Date());
  const { after, before } = formatRangeDates(start, end);

  const [orders, stats] = await Promise.all([
    fetchOrdersReport(
      after,
      before,
      params?.page ? Number(params.page) : 1,
      params?.per_page ? Number(params.per_page) : 25,
    ),
    fetchOrdersStats(after, before),
  ]);

  const chartData = (stats?.intervals || []).map(
    (it: OrdersReportStats["intervals"][number]) => ({
      date: it.interval,
      current: it.subtotals?.net_revenue ?? 0,
      previous: 0,
    }),
  );

  const totals = stats?.totals ?? {
    orders_count: 0,
    total_customers: 0,
    num_items_sold: 0,
    coupons_count: 0,
    net_revenue: 0,
    products: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders Report</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your order patterns and trends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-2xl font-bold mt-2">{totals.orders_count}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Net Revenue</p>
          <p className="text-2xl font-bold mt-2">
            ₦{(totals.net_revenue ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Items Sold</p>
          <p className="text-2xl font-bold mt-2">{totals.num_items_sold}</p>
        </div>
      </div>

      <SalesChart
        data={chartData}
        title={`Orders (${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")})`}
      />

      <OrdersTable orders={orders} />
    </div>
  );
}
