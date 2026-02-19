"use client";

import { OrdersReportItem } from "@/lib/actions/dashboard/orders-reports";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface OrdersTableProps {
  orders: OrdersReportItem[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No orders for the selected range.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Date</TableHead>
            <TableHead>Order #</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px]">Customer</TableHead>
            <TableHead className="w-[140px] text-right">Net</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.order_id}>
              <TableCell className="text-sm text-muted-foreground">{format(new Date(o.date), "MMM dd, yyyy")}</TableCell>
              <TableCell className="font-medium">#{o.order_number ?? o.order_id}</TableCell>
              <TableCell className="text-sm">{o.status}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{o.extended_info?.customer?.username ?? o.customer_id ?? "-"}</TableCell>
              <TableCell className="text-right">{typeof o.total_sales === 'number' ? `₦${o.total_sales.toFixed(2)}` : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
