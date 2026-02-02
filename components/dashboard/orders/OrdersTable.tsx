"use client";

import { VendorOrderDisplay } from "@/lib/user/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OrdersTableProps {
  orders: VendorOrderDisplay[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const toggleOrder = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const isAllSelected = orders.length > 0 && selectedOrders.length === orders.length;
  const isSomeSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all orders"
                  className={cn(isSomeSelected && "data-[state=checked]:bg-primary/50")}
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Order
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Total
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Earning
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr
                key={order.id}
                className={cn(
                  "hover:bg-muted/50 transition-colors",
                  selectedOrders.includes(order.id) && "bg-muted/30"
                )}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => toggleOrder(order.id)}
                    aria-label={`Select order ${order.orderNumber}`}
                  />
                </td>
                <td className="p-4">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-4 font-medium">
                  {order.currency === "NGN" ? "₦" : order.currency}
                  {parseFloat(order.total).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-4 font-medium text-green-600 dark:text-green-500">
                  {order.currency === "NGN" ? "₦" : order.currency}
                  {parseFloat(order.earning).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-4">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y">
        {orders.map((order) => (
          <div
            key={order.id}
            className={cn(
              "p-4 space-y-3",
              selectedOrders.includes(order.id) && "bg-muted/30"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => toggleOrder(order.id)}
                  aria-label={`Select order ${order.orderNumber}`}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="font-medium text-primary hover:underline block"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(order.date).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 pl-9">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="font-medium">
                  {order.currency === "NGN" ? "₦" : order.currency}
                  {parseFloat(order.total).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Earning</p>
                <p className="font-medium text-green-600 dark:text-green-500">
                  {order.currency === "NGN" ? "₦" : order.currency}
                  {parseFloat(order.earning).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar (shown when items selected) */}
      {selectedOrders.length > 0 && (
        <div className="border-t bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedOrders.length} order{selectedOrders.length !== 1 && "s"} selected
            </p>
            <div className="flex gap-2">
              {/* Bulk actions can be added here */}
              <button
                onClick={() => setSelectedOrders([])}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
