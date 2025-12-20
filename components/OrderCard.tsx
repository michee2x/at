import { WooOrder } from "@/lib/user/types";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { ClockArrowDown, ClockCheck, Plus } from "lucide-react";
import Link from "next/link";

const OrderCard = ({ order }: { order: WooOrder | null }) => {
  if (!order) return null;

  const lineItems = (order: WooOrder) =>
    order.line_items.slice(0, 5).map((item) => ({
      ...item,
      image: item.image?.src,
    }));

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 lg:p-5 shadow-sm hover:shadow-md transition">
      {/* Top: Items + Status */}
      <div className="flex items-start flex-col justify-between gap-4">
        <div className="flex items-center">
          <AnimatedTooltip items={lineItems(order)} />

          {order.line_items.length - 2 > 0 && (
            <span className="ml-4 h-12 w-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
              <Plus className="w-4 h-4 mr-0.5" />
              {order.line_items.length - 2}
            </span>
          )}
        </div>

        {/* Status */}
        {order.status === "pending" && (
          <Link
            href={`/order/success/${order.id}`}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
              bg-[#6a00f3]/10 text-[#6a00f3]
              hover:bg-[#6a00f3]/15 transition"
          >
            <ClockArrowDown className="w-4 h-4" />
            Pending
          </Link>
        )}

        {order.status === "processing" && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
              bg-green-100 text-green-700"
          >
            <ClockCheck className="w-4 h-4" />
            Processing
          </span>
        )}
      </div>

      {/* Order reference */}
      <div className="mt-4">
        <p className="text-[15.5px] font-medium text-gray-900">
          {order.order_key?.replace("wc_order_", "")}
        </p>
        <p className="text-sm text-gray-500">Delivery code</p>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-gray-100" />

      {/* Footer */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total amount</p>
          <p className="text-sm font-semibold text-gray-900">₦{order.total}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Delivery address</p>
          <p className="text-sm font-medium text-gray-900">
            {order?.billing.address_2
              ? order.billing.address_2.length > 26
                ? `${order.billing.address_2.slice(0, 26)}...`
                : order.billing.address_2
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
