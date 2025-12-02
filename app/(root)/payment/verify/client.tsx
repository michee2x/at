"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderSuccessfull from "@/components/lottie/OrderSuccessfull";

// define proper type for verified payment data
interface VerifiedPayment {
  success: boolean;
  orderId: string;
  reference: string;
  amount: number; // amount in kobo
  paidAt: string; // ISO date string
}

export default function VerifyPayment() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("Verifying payment...");
  const [verifiedData, setVerifiedData] = useState<VerifiedPayment | null>(
    null
  );

  useEffect(() => {
    async function verify() {
      if (!reference) {
        setStatus("Missing payment reference.");
        return;
      }

      try {
        const res = await fetch(`/api/payments/verify?reference=${reference}`);
        const data: VerifiedPayment & { success: boolean } = await res.json();

        if (data.success) {
          setStatus("success");
          setVerifiedData(data);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    }

    verify();
  }, [reference]);

  // UI
  if (status === "Verifying payment...") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">{status}</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Failed ❌
        </h1>
        <p className="text-red-700 mb-6">
          Your payment could not be verified. Please try again or contact
          support.
        </p>
        <a
          href="/checkout"
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          Retry Payment
        </a>
      </div>
    );
  }

  // Success UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-40 h-40 mx-auto mb-8">
          <OrderSuccessfull />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {verifiedData && (
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">
              <strong>Order ID:</strong> {verifiedData.orderId}
            </p>
            <p className="text-gray-700">
              <strong>Reference:</strong> {verifiedData.reference}
            </p>
            <p className="text-gray-700">
              <strong>Amount Paid:</strong> ₦
              {(verifiedData.amount / 100).toLocaleString()}
            </p>
            <p className="text-gray-700">
              <strong>Paid At:</strong>{" "}
              {new Date(verifiedData.paidAt).toLocaleString()}
            </p>
          </div>
        )}

        <a
          href="/dashboard/orders"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          View My Orders
        </a>
      </div>
    </div>
  );
}
