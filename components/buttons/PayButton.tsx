"use client";
import { WooOrder } from '@/lib/user/types';
import { Loader2, Lock } from 'lucide-react';
import React, { useState } from 'react'

interface PaymentStatus {
  status: "idle" | "processing" | "success" | "error";
  message: string;
}

const PayButton = ({orderDetails}:{orderDetails: WooOrder}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
      status: "idle",
      message: "",
    });

    const handlePayment = async () => {
      setIsLoading(true);
      setPaymentStatus({
        status: "processing",
        message: "Initializing payment...",
      });

      try {
        // Step 1: Initialize payment with your backend
        const initResponse = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderDetails.id,
            amount: Math.round(parseFloat(orderDetails.total) * 100), // Convert to kobo
            email: orderDetails.billing.email,
            currency: orderDetails.currency,
          }),
        });

        if (!initResponse.ok) {
          throw new Error("Failed to initialize payment");
        }

        const { authorizationUrl, reference } = await initResponse.json();

        // Step 2: Redirect to Paystack
        window.location.href = authorizationUrl;
      } catch (error) {
        setPaymentStatus({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Payment initialization failed",
        });
        setIsLoading(false);
      }
    };
  return (
    <button
      onClick={handlePayment}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
    >
      {false ? (
        <>
          <Loader2 className="animate-spin mr-2" size={20} />
          Processing...
        </>
      ) : (
        <>
          <Lock className="mr-2" size={20} />
          Pay {orderDetails.currency}{" "}
          {parseFloat(orderDetails.total).toLocaleString()}
        </>
      )}
    </button>
  );
}

export default PayButton