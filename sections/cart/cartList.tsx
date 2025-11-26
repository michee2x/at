"use client";

import React from "react";
import CartItem from "./cartItem";
import CartItemSkeleton from "@/components/skeletons/CartItemSkeleton";
import { useCart } from "@/hooks/useCart";

export default function CartList() {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((n) => (
          <CartItemSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (!cart?.items?.length) return <p>Your cart is empty.</p>;

  return (
    <div className="flex flex-col gap-5">
      {cart.items.map((item, idx) => (
        <CartItem item={item} key={idx} />
      ))}
    </div>
  );
}
