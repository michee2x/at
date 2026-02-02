"use client";

import React, { useEffect, useState } from "react";
import OrderSummarySkeleton from "@/components/skeletons/OrderSummarySkeleton";
import { useCart } from "@/hooks/useCart";
import { Cart } from "@/types";
import CartSummaryButton from "@/components/cart/CartSummaryButton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateCoupon } from "@/lib/actions/checkout/coupon";
import { AppliedCoupon } from "@/types/checkout";
import { Loader2 } from "lucide-react";

export default function OrderSummary({
  showCheckoutButton = true,
  appliedCoupon,
  setAppliedCoupon,
}: {
  showCheckoutButton?: boolean;
  appliedCoupon?: AppliedCoupon | null;
  setAppliedCoupon?: (coupon: AppliedCoupon | null) => void;
}) {
  const { cart, isLoading } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState("");
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
    const total = subtotal + packagingFee + serviceFee + deliveryFee - (appliedCoupon?.discountAmount || 0);

    setData({
      subtotal,
      packagingFee,
      serviceFee,
      deliveryFee,
      total: Math.max(0, total),
    });
  }, [cart, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!cart || !couponCode.trim()) return;
    
    setIsValidating(true);
    setCouponError("");

    const cartTotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const result = await validateCoupon(
      couponCode,
      cartTotal,
      cart.items.map(i => ({ id: i.id, quantity: i.quantity, price: Number(i.price) }))
    );

    setIsValidating(false);

    if (result.success && result.coupon && result.discountAmount !== undefined) {
      if (setAppliedCoupon) {
        setAppliedCoupon({
            code: result.coupon.code,
            discountAmount: result.discountAmount,
            couponData: result.coupon,
        });
      }
      setCouponCode(""); 
    } else {
      setCouponError(result.error || "Failed to apply coupon");
      // Clear coupon if invalid? ensure we don't leave stale state if user tries new code? 
      // Maybe not necessary to clear applied coupon if just new try failed.
    }
  };

  const removeCoupon = () => {
    if (setAppliedCoupon) setAppliedCoupon(null);
  };

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

        {appliedCoupon && (
            <div className="flex justify-between items-center text-green-600">
                <div className="flex items-center gap-2">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <button onClick={removeCoupon} className="text-xs underline text-red-500 hover:text-red-600">
                        Remove
                    </button>
                </div>
                <span className="font-medium">-₦{appliedCoupon.discountAmount.toLocaleString()}</span>
            </div>
        )}

        {!appliedCoupon && setAppliedCoupon && (
            <div className="pt-2">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Coupon code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-white"
                    />
                    <Button 
                        onClick={handleApplyCoupon}
                        disabled={isValidating || !couponCode.trim()}
                        variant="outline"
                        className="min-w-[80px]"
                    >
                        {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            </div>
        )}

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
