"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderSuccessfull from "@/components/lottie/OrderSuccessfull";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";
import { Check, XCircle, AlertTriangle, ArrowRight, CreditCard, Calendar, Hash, Truck, Package, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const [status, setStatus] = useState("verifying");
  const [verifiedData, setVerifiedData] = useState<VerifiedPayment | null>(
    null
  );

  useEffect(() => {
    async function verify() {
      if (!reference) {
        setStatus("missing_ref");
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

  // Loading UI
  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
        <div className="w-32 h-32 md:w-48 md:h-48">
          <AtlazeLoader />
        </div>
        <p className="text-gray-500 font-medium mt-4 animate-pulse">Verifying your payment...</p>
      </div>
    );
  }

  // Error UI
  if (status === "failed" || status === "missing_ref") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-8">
            {status === "missing_ref" 
              ? "We couldn't find a payment reference to verify." 
              : "We couldn't verify your payment. This could be due to a network issue or a declined transaction."}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/checkout" className="w-full">
              <Button className="w-full h-12 bg-[#6a00f3] hover:bg-[#5a00d3] text-white font-medium">
                Return to Checkout
              </Button>
            </Link>
            <Link href="/help" className="w-full">
              <Button variant="outline" className="w-full h-12 border-gray-200">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success UI
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-12 text-center">
            
            {/* Success Animation */}
            <div className="w-32 h-32 mx-auto mb-6">
              <OrderSuccessfull />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 max-w-md mx-auto mb-10">
              Your payment has been confirmed. We&apos;ve sent a receipt to your email and your order is now being processed.
            </p>

            {/* Timeline */}
             <div className="mb-10">
              <div className="relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                  
                  {/* Step 1: Placed */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-[#6a00f3] flex items-center justify-center shadow-lg shadow-[#6a00f3]/20 shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-bold text-gray-900 text-sm">Placed</p>
                    </div>
                  </div>

                  {/* Step 2: Payment (Done) */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10">
                     <div className="w-8 h-8 rounded-full bg-[#6a00f3] flex items-center justify-center shadow-lg shadow-[#6a00f3]/20 shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-bold text-gray-900 text-sm">Payment</p>
                    </div>
                  </div>

                  {/* Step 3: Processing */}
                   <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10">
                     <div className="w-8 h-8 rounded-full bg-white border-2 border-[#6a00f3] flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-[#6a00f3]" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-semibold text-gray-900 text-sm">Processing</p>
                    </div>
                  </div>

                  {/* Step 4: Shipping */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 opacity-50">
                     <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="sm:text-center">
                      <p className="font-medium text-gray-500 text-sm">Shipping</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Receipt Card */}
            {verifiedData && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                  Transaction Receipt
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2"><Hash className="w-4 h-4" /> Order Reference</span>
                    <span className="font-mono font-medium text-gray-900">{verifiedData.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Gateway Ref</span>
                    <span className="font-mono font-medium text-gray-900">{verifiedData.reference}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
                    <span className="font-medium text-gray-900">{new Date(verifiedData.paidAt).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center mt-3">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="text-xl font-bold text-[#6a00f3]">
                      ₦{(verifiedData.amount / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/my-account/orders" className="w-full sm:w-auto">
                <Button className="w-full h-12 bg-[#6a00f3] hover:bg-[#5a00d3] text-white text-base px-8">
                  View My Orders
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-12 border-gray-200 text-gray-700 text-base px-8">
                  Continue Shopping
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
