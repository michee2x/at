"use client";

import React from "react";
import { WooOrder } from "@/lib/user/types";
import { Check, CreditCard, ShoppingBag, ArrowRight, Package, Truck, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PayButton from "@/components/buttons/PayButton";

export default function OrderSuccessClient({ initialOrder }: { initialOrder: WooOrder }) {
  if (!initialOrder) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Hero: Order Placed / Payment Pending */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CreditCard className="w-10 h-10 text-yellow-600" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Your order <span className="font-semibold text-gray-900">#{initialOrder.id}</span> has been created. 
            Please complete your payment to finalize the order.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          
          {/* Order Header */}
          <div className="bg-[#6a00f3]/5 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#6a00f3]/10">
            <div>
              <p className="text-sm font-medium text-[#6a00f3] mb-1">Order Reference</p>
              <p className="text-2xl font-bold text-gray-900">#{initialOrder.id}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-[#6a00f3]">
                {initialOrder.currency} {parseFloat(initialOrder.total).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Timeline */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status</h3>
              <div className="relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                  
                  {/* Step 1: Placed */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#6a00f3] flex items-center justify-center shadow-lg shadow-[#6a00f3]/20 shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-bold text-gray-900">Placed</p>
                      <p className="text-xs text-green-600 font-medium">Done</p>
                    </div>
                  </div>

                  {/* Step 2: Payment (Active) */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10">
                     <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center shrink-0 animate-pulse">
                      <CreditCard className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-bold text-gray-900">Payment</p>
                      <p className="text-xs text-yellow-600 font-bold">Pending...</p>
                    </div>
                  </div>

                  {/* Step 3: Processing */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 opacity-50">
                     <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-medium text-gray-500">Processing</p>
                      <p className="text-xs text-gray-400">Waiting</p>
                    </div>
                  </div>

                  {/* Step 4: Shipping */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 opacity-50">
                     <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-medium text-gray-500">Shipping</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Payment Action Area */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                 <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2 justify-center sm:justify-start">
                  <AlertCircle className="w-5 h-5" />
                  Payment Required
                </h3>
                <p className="text-yellow-700 text-sm max-w-sm">
                  To ensure your items are reserved and processed, please complete the payment securely via Paystack.
                </p>
              </div>
              <div className="w-full sm:w-auto min-w-[200px]">
                <PayButton orderDetails={initialOrder} />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                  </span>
                  Payment Details
                </h3>
                <div className="pl-10 text-sm text-gray-600 space-y-1">
                  <p>Payment Method: <span className="fw-medium text-gray-900">{initialOrder.payment_method_title}</span></p>
                  <p>Payment Status: <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800">Pending</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-gray-600" />
                  </span>
                  Shipping Details
                </h3>
                <div className="pl-10 text-sm text-gray-600 space-y-1">
                  <p>{initialOrder.billing.first_name} {initialOrder.billing.last_name}</p>
                  <p>{initialOrder.billing.address_1}</p>
                  {initialOrder.billing.address_2 && <p>{initialOrder.billing.address_2}</p>}
                  <p>{initialOrder.billing.city}, {initialOrder.billing.state}</p>
                  <p>{initialOrder.billing.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link href="/my-account/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-12 text-base border-gray-200 hover:bg-gray-50 text-gray-700">
              View Order Details
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
             <Button className="w-full h-12 text-base bg-white border border-gray-200 hover:bg-gray-50 text-gray-900">
              Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
