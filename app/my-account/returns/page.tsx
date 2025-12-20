"use server";

import { Suspense } from "react";
import Link from "next/link";
import { getOrders } from "@/lib/actions/dashboard/orders";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function ReturnsContent() {
  const { orders = [] } = await getOrders(1, 10);

  // Placeholder mapping: real return/refund data would come from a dedicated endpoint or order meta.
  const rows = orders.map((order) => ({
    id: order.id,
    number: order.number,
    vendor: "Atlaze", // no vendor info available in current data shape
    type: "Return/Refund",
    status: order.status ?? "pending",
    created: order.date_created,
  }));

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Returns &amp; Refunds
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your return or refund requests. If you need help, contact
          support with your order ID.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm text-gray-600">
                    No requests found
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      #{row.number ?? row.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {row.vendor}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {row.type}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {row.status}
                      </span>
                    </td>
                    {row.created && <td className="px-4 py-4 text-sm text-gray-700">
                      {formatDate(row.created)}
                    </td>}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
        <p className="mb-1 font-medium text-gray-800">
          Need help with a return?
        </p>
        <p>
          If you need to start a return or refund, please contact support with
          your order ID and a brief description. We&apos;ll guide you through
          the next steps.
        </p>
        <div className="mt-3">
          <Link
            href="mailto:support@atlaze.com"
            className="inline-flex items-center rounded-full bg-[#6a00f3] px-4 py-2 text-xs font-medium text-white hover:bg-[#5a00d0] transition"
          >
            Email Atlaze support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ReturnsPage() {
  return (
    <div className="min-h-[50vh]">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-16">
            <div className="w-28 h-28">
              <AtlazeLoader />
            </div>
          </div>
        }
      >
        <ReturnsContent />
      </Suspense>
    </div>
  );
}
