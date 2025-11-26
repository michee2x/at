"use client";

import React, { useEffect, useState } from "react";
import OrderSummarySkeleton from "@/components/skeletons/OrderSummarySkeleton";
import { useCart } from "@/hooks/useCart";
import { Cart } from "@/types";

const OrderSummary = () => {
  const { cart, isLoading } = useCart();

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    packagingFee: 2000.05,
    serviceFee: 500.05,
    deliveryFee: 2000.05,
    total: 0,
  });

 function computeOrderSummary(cart: Cart | null) {
   if (!cart) return;

   const subtotal = cart.items.reduce((sum, item) => {
     const price = Number(item.price) || 0;
     return sum + price * item.quantity;
   }, 0);

   const packagingFee = 2000.05;
   const serviceFee = 500.05;
   const deliveryFee = 2000.05;

   const total = subtotal + packagingFee + serviceFee + deliveryFee;

   setOrderSummary({
     subtotal,
     packagingFee,
     serviceFee,
     deliveryFee,
     total,
   });
 }


  useEffect(() => {
    if (cart) computeOrderSummary(cart);
  }, [cart]);

  // 👉 isLoading skeleton
  if (isLoading || !cart) return <OrderSummarySkeleton />;

  return (
    <div className="w-[463px] border-[1.28px] rounded-[10.23px] p-[12.79px] border-[#F5F5F5] h-[481px]">
      <h1 className="text-[23.02px]">Order Summary</h1>

      <div className="text-[#343A40] flex flex-col lg:gap-3 mt-5">
        {[
          {
            name: "Sub Total",
            value: `#${orderSummary.subtotal.toLocaleString()}`,
          },
          {
            name: "Packaging Fee",
            value: `#${orderSummary.packagingFee.toLocaleString()}`,
          },
          {
            name: "Service Fee",
            value: `#${orderSummary.serviceFee.toLocaleString()}`,
          },
          {
            name: "Delivery Fee",
            value: `#${orderSummary.deliveryFee.toLocaleString()}`,
          },
        ].map(({ name, value }) => (
          <li
            key={name}
            className="flex h-[55px] border-[#EFEFEF] border-y-[1.28px] py-[15.35px] px-[2.56px] justify-between items-center"
          >
            <h3 className="lg:text-[20.46px] text-[17px]">{name}</h3>
            <span className="lg:text-[17.91px] text-[14px]">{value}</span>
          </li>
        ))}
        <li className="flex h-[55px] border-[#EFEFEF] border-y-[1.28px] py-[15.35px] px-[2.56px] justify-between items-center text-[18px] lg:text-[23.02px]">
          <h3>Total Fee</h3>
          <span>#{orderSummary.total.toLocaleString()}</span>
        </li>
      </div>

      <div className="mt-5 flex gap-3 flex-col items-center">
        <span className="text-[15.35px] text-center font-bold">
          You are #5,000 away from free delivery
        </span>

        <progress
          className="progress w-full [--p:70] [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-[#F7B232]"
          value="70"
          max="100"
        ></progress>

        <button className="btn text-[17px] btn-neutral py-6 mt-4 w-full rounded-lg lg:text-[20.46px] font-normal">
          Payment Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
