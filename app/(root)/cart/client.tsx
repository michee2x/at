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
} from "@/components/ui/dialog";
import OrderSummary from "@/sections/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { Info, Truck } from "lucide-react";

export function DialogDeleteDemo() {
  const itemToDelete = useCart((state) => state.itemToDelete);
  const removeItem = useCart((state) => state.removeItem);
  const setItemToDelete = useCart((state) => state.setItemToDelete);

  if (!itemToDelete) return null;

  const handleConfirm = async () => {
    await removeItem(itemToDelete.id);
    setItemToDelete(null);
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Remove Product</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove &quot;{itemToDelete.name}&quot; from your cart?
          This action can&apos;t be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button variant="outline" onClick={() => setItemToDelete(null)}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Remove
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

const CartPage = () => {
  return (
    <Dialog>
      <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Cart Section */}
          <div className="lg:col-span-8">
            {/* Free Delivery Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-4 text-blue-900">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Free Delivery Available</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Applies to orders of ₦20,000.00 or more. <span className="underline cursor-pointer font-medium hover:text-blue-900">View details</span>
                </p>
              </div>
            </div>

            {/* Cart List */}
            <CartList />
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <OrderSummary />
              
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 justify-center">
                <Info className="w-4 h-4" />
                <span>Secure Checkout using Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogDeleteDemo />
    </Dialog>
  );
};

export default CartPage;
