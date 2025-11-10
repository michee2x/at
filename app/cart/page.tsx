"use client";

import CartList from "@/sections/cart/cartList";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";

export function DialogDeleteDemo() {
  const { removeFromCart, itemToDelete } = useCart();
  if (!itemToDelete) return null;
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Remove Product</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove “{itemToDelete.name}” from your cart?.
          This action can’t be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4"></div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            onClick={() => removeFromCart(itemToDelete.slug)}
            type="submit"
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            Delete
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

const page = () => {
  return (
    <Dialog>
      <div className="w-screen px-2 container flex lg:flex-row flex-col mx-auto lg:px-10 pt-7 min-h-screen">
        <div className="lg:w-1/2">
          <div className="w-full h-[68px] bg-[#F5F5F5] pl-[4px]">
            <h1 className="text-[16px]">Free Delivery</h1>
            <h3 className="text-[14px] mt-[3px]">
              Applies to orders of #20 000.00 or more.{" "}
              <span className="underline">View details</span>
            </h3>
          </div>
          {/* PRODUCTS */}
          <div className="lg:w-[90%] mt-6 flex flex-col gap-5 min-h-[20rem]">
            <h1 className="helvetica hidden lg:flex">Your Cart</h1>
            <CartList />
          </div>
        </div>
        <div className="flex-1 mt-10 lg:mt-0 flex justify-center">
          <div className="w-[463px] border-[1.28px] rounded-[10.23px] p-[12.79px] border-[#F5F5F5] h-[481px]">
            <h1 className="text-[23.02px]">Order Summary</h1>
            <div className="text-[#343A40] flex flex-col lg:gap-3 mt-5">
              {[
                { name: "Sub Total", value: "#320,768.31" },
                { name: "Packaging Fee", value: "#2000.05" },
                { name: "Service Fee", value: "#500.05" },
                { name: "Delivery Fee", value: "#2000.05" },
              ].map(({ name, value }) => {
                return (
                  <li
                    key={`${name}-${value}`}
                    className="flex h-[55px] border-[#EFEFEF] border-y-[1.28px] py-[15.35px] px-[2.56px] justify-between items-center"
                  >
                    <h3 className="lg:text-[20.46px] text-[17px]">{name}</h3>
                    <span className="lg:text-[17.91px] text-[14px]">
                      {value}
                    </span>
                  </li>
                );
              })}
              <li className="flex h-[55px] border-[#EFEFEF] border-y-[1.28px] py-[15.35px] px-[2.56px] justify-between items-center text-[18px] lg:text-[23.02px]">
                <h3>Total Fee</h3>
                <span>#450,010</span>
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
        </div>
        <DialogDeleteDemo />
      </div>
    </Dialog>
  );
};

export default page;
