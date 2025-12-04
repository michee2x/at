"use client";

import React, { useEffect, useState } from "react";
import { WooOrder } from "@/lib/user/types";
import { toNumber } from "@/utils/to-number";
import { User } from "@/lib/user/User";
import { CreditCard, Lock } from "lucide-react";
import PayButton from "@/components/buttons/PayButton";
import { useAuth } from "@/contexts/auth-context";
import { getUserOrderByIdAction } from "@/lib/actions/UserAction";

export default function OrderSuccess({ orderId }: { orderId: string }) {
  const { session } = useAuth(); // get user session from context

  const [orderDetails, setOrderDetails] = useState<WooOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("session in order success page: ", session);
    async function fetchOrder() {
      if (!session?.user?.id) {
        setError("You are not signed in");
        setLoading(false);
        return;
      }

      try {
        const customerId = toNumber(session.user.id);
        const user = new User({ id: customerId });

        const order = await getUserOrderByIdAction(customerId,
          Number(orderId.replace(":", ""))
        );
        if (!order) {
          setError("Order not found");
        } else {
          setOrderDetails(order);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load order. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [session]);

  if (!session) {
    return <div className="p-6 text-gray-500 w-screen h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {orderDetails ? (
        <div className="max-w-xl mt-5 lg:mt-0 mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Order
            </h1>
            <p className="text-gray-600">Secure payment powered by Paystack</p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="mr-2 text-indigo-600" size={24} />
              Order Summary
            </h2>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">
                  #{orderDetails.id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium text-gray-900">
                  {orderDetails.billing.first_name}{" "}
                  {orderDetails.billing.last_name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">
                  {orderDetails.billing.email}
                </span>
              </div>
              <div className="flex flex-wrap justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-2xl text-nowrap font-bold text-indigo-600">
                  {orderDetails.currency}{" "}
                  {parseFloat(orderDetails.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Button Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <PayButton orderDetails={orderDetails} />
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <Lock size={16} className="mr-2" />
              Secure payment with 256-bit SSL encryption
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>By proceeding, you agree to our terms of service</p>
          </div>
        </div>
      ) : (
        <div className="p-6 w-full h-full flex items-center justify-center">
          <span className="loading loading-spinner text-blue-600 loading-xl"></span>
        </div>
      )}
    </div>
  );
}
