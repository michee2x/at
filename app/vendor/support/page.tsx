import {
  getVendorSupportStats,
  getVendorSupportTickets,
} from "@/lib/actions/vendor/support";
import { TicketStats } from "@/components/dashboard/support/ticket-stats";
import { VendorTicketsTable } from "@/components/vendor/support/TicketsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 60;

export default async function VendorSupportPage({
  searchParams,
}: {
  searchParams?: any;
}) {
  // basic filters from query
  const params = searchParams || {};

  const stats = await getVendorSupportStats();
  const tickets = await getVendorSupportTickets({
    page: params?.page ? Number(params.page) : 1,
    per_page: params?.per_page ? Number(params.per_page) : 10,
    status: params?.status,
    customer_id: params?.customer_id ? Number(params.customer_id) : undefined,
    start_date: params?.start_date || params?.date,
    end_date: params?.end_date,
    search: params?.search,
  });

  const counts = {
    open: stats.open ?? 0,
    closed: stats.closed ?? 0,
    pending: 0,
    active: 0,
    unread: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vendor support tickets and messages
        </p>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <TicketStats counts={counts} />
      </Suspense>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-4">
          <VendorTicketsTable tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="border-none shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
