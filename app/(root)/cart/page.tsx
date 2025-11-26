// /app/cart/page.tsx
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
import OrderSummary from "@/sections/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";

export function DialogDeleteDemo() {
  //const { removeFromCart, itemToDelete } = useCart();
  const itemToDelete = useCart((state) => state.itemToDelete);
  const removeItem = useCart((state) => state.removeItem);
  const setItemToDelete = useCart((state) => state.setItemToDelete);

  if (!itemToDelete) return null;

  const handleConfirm = async () => {
    await removeItem(itemToDelete.id);
    setItemToDelete(null); // reset
  };
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
          <Button variant="outline" onClick={() => setItemToDelete(null)}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            onClick={handleConfirm}
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

const CartPage = () => {


  return (
    <Dialog>
      <div className="w-screen px-2 container flex lg:flex-row flex-col mx-auto lg:px-10 pt-7 min-h-screen">
        <div className="lg:w-1/2">
          <div className="w-full h-[68px] bg-[#F5F5F5] p-[8px]">
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
          <OrderSummary />
        </div>
        <DialogDeleteDemo />
      </div>
    </Dialog>
  );
};

export default CartPage;
