import React from "react";
import OrderSuccessClient from "./OrderSuccessClient";
import { getUserOrderByIdAction } from "@/lib/actions/UserAction";
import { toNumber } from "@/utils/to-number";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const resolvedParams = await params;
  const idStr = resolvedParams?.id;

  if (!idStr) {
    return <div className="p-6 text-red-600">Invalid order ID</div>;
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const customerId = toNumber(session.user.id);
  // Handle potential colon in ID as seen in previous client code
  const orderId = Number(idStr.replace(":", ""));
  
  const order = await getUserOrderByIdAction(customerId, orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <p className="text-gray-600 mt-2">Could not locate order #{orderId}</p>
        </div>
      </div>
    );
  }

  return <OrderSuccessClient initialOrder={order} />;
}
