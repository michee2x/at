"use client";

import React, { useEffect, useState } from "react";
import { getUserOrdersAction } from "@/lib/actions/UserAction";
import { WooOrder } from "@/lib/user/types";
import { toNumber } from "@/utils/to-number";
import OrderCard from "@/components/OrderCard";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { useAuth } from "@/contexts/auth-context";
import OrderCardSkeleton from "@/components/skeletons/OrderCardSkeleton";

export default function OrdersPage() {
  const {session} = useAuth()
  const [orders, setOrders] = useState<WooOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        console.log("session in orders page: ", session)
        if (!session?.user?.id) {
          setError("You are not signed in");
          setLoading(false);
          return;
        }

        const customerId = toNumber(session.user.id);

        // 2️⃣ Fetch orders
        const userOrders = await getUserOrdersAction(customerId);
        setOrders(userOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session]);

  if (!session) {
    return (
      <div className="p-6 text-gray-500 w-screen h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-blue-600 loading-xl"></span>
      </div>
    );
  }

  // if (orders.length === 0) {
  //   return <div className="p-6">You have no orders yet.</div>;
  // }

  return (
    <div className="container px-4 mx-auto pt-6 lg:px-6">
      <AnimatedTooltipPreview orders={orders} />
    </div>
  );
}

export function AnimatedTooltipPreview({ orders }: { orders: WooOrder[] }) {
  return (
    <div className="mb-10 font-poppins px-4 w-full">
      <div className="w-full py-4 lg:px-8 mt-4 mb-2 h-auto flex flex-col lg:flex-row justify-between">
        <span className="text-[#8cbef0] text-[14px] lg:text-[21px] font-[SF Pro Display] font-[500]">
          Your orders for this month
        </span>
        <span className="text-[#ED473D] text-[14px] lg:text-[16px] font-[SF Pro Display] font-[500]">
          Live Order Tracking (1)
        </span>
      </div>
      <div className="min-w-full lg:p-4 grid-cols-1 lg:grid-cols-3 grid gap-10 h-auto">
        {orders.length > 0 ? orders.map((order, idx) => (
          <OrderCard key={idx} order={order} />
        )):Array(3).fill(0).map((_, idx) => <OrderCardSkeleton key={idx} />)}
      </div>
    </div>
  );
}
