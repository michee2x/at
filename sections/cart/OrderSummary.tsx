"use client";

import React, { useEffect, useState } from "react";
import OrderSummarySkeleton from "@/components/skeletons/OrderSummarySkeleton";
import { useCart } from "@/hooks/useCart";
import { Cart } from "@/types";
import CartSummaryButton from "@/components/cart/CartSummaryButton";
import { Separator } from "@/components/ui/separator";

export default function OrderSummary({
  showCheckoutButton = true,
}: {
  showCheckoutButton?: boolean;
}) {
  const { cart, isLoading } = useCart();
  const [data, setData] = useState({
    subtotal: 0,
    packagingFee: 2000.05,
    serviceFee: 500.05,
    deliveryFee: 2000.05,
    total: 0,
  });

  useEffect(() => {
    if (!cart) return;

    // Calculate subtotal from cart items
    const subtotal = cart.items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price * item.quantity;
    }, 0);

    const packagingFee = 2000.05;
    const serviceFee = 500.05;
    const deliveryFee = 2000.05;

    // Total calculation
    const total = subtotal + packagingFee + serviceFee + deliveryFee;

    setData({
      subtotal,
      packagingFee,
      serviceFee,
      deliveryFee,
      total,
    });
  }, [cart]);

  if (isLoading || !cart) return <OrderSummarySkeleton />;

  return (
    <div className="w-full bg-gray-50/50 rounded-2xl p-6 lg:p-8 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

      <div className="space-y-4 text-sm">
        <SummaryRow label="Subtotal" value={data.subtotal} />
        
        {/* Fees (can be conditional later) */}
        <SummaryRow label="Packaging Fee" value={data.packagingFee} />
        
        <SummaryRow label="Service Fee" value={data.serviceFee} />
        <SummaryRow label="Delivery Fee" value={data.deliveryFee} />

        <Separator className="my-4 bg-gray-200" />

        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-[#6a00f3]">
            ₦{data.total.toLocaleString()}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Determined tax and shipping costs are calculated at checkout.
        </p>
      </div>

      {showCheckoutButton && (
        <div className="pt-2">
          <CartSummaryButton />
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center text-gray-600">
      <span>{label}</span>
      <span className="font-medium text-gray-900">₦{value.toLocaleString()}</span>
    </div>
  );
}
