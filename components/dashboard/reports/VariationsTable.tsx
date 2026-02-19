"use client";

import React from "react";
import type { VariationsReportItem } from "@/lib/actions/dashboard/variations-reports";

export function VariationsTable({
  variations,
  totals,
}: {
  variations: VariationsReportItem[];
  totals?: { items_sold?: number; net_revenue?: number; orders_count?: number };
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left p-3">Variation</th>
            <th className="text-left p-3">SKU</th>
            <th className="text-right p-3">Items Sold</th>
            <th className="text-right p-3">Net Sales</th>
            <th className="text-right p-3">Orders</th>
          </tr>
        </thead>
        <tbody>
          {variations && variations.length ? (
            variations.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{v.name}</div>
                </td>
                <td className="p-3">{v.sku ?? "—"}</td>
                <td className="p-3 text-right">{v.items_sold ?? 0}</td>
                <td className="p-3 text-right">
                  ₦{(v.net_revenue ?? 0).toLocaleString()}
                </td>
                <td className="p-3 text-right">{v.orders_count ?? 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-6 text-center text-muted-foreground">
                No variations found for this range.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="border-t">
          <tr>
            <td className="p-3 font-bold">Totals</td>
            <td />
            <td className="p-3 text-right font-bold">
              {totals?.items_sold ?? 0}
            </td>
            <td className="p-3 text-right font-bold">
              ₦{(totals?.net_revenue ?? 0).toLocaleString()}
            </td>
            <td className="p-3 text-right font-bold">
              {totals?.orders_count ?? 0}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
