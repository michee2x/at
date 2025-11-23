"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./cartItem";
import CartItemSkeleton from "@/components/skeletons/CartItemSkeleton";

export default function CartList() {
  const { cart, loading } = useCart();

  if (loading) {
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
