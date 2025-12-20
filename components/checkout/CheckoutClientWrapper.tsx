"use client";

import { useState } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/sections/cart/OrderSummary";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";
import { BillingInfo } from "@/types/checkout";
import { useCheckout } from "@/hooks/useCheckout";

export function CheckoutClientWrapper({
  defaultBilling,
}: {
  defaultBilling: BillingInfo | undefined;
}) {
  const [deliveryMethod, setDeliveryMethod] = useState<"deliver" | "pickup">(
    "deliver"
  );

  const { isPlacingOrder, error, placeOrder } = useCheckout();

  const handleContinue = async (
    values: BillingInfo & { deliveryMethod: "deliver" | "pickup" }
  ) => {
    await placeOrder(values);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full">
      <section className="lg:col-span-8 w-full">
        <CheckoutForm
          defaultValues={defaultBilling}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          loading={isPlacingOrder}
          onContinue={handleContinue}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}
      </section>

      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-40">
          <OrderSummary
            showCheckoutButton={false}
            deliveryMethod={deliveryMethod}
          />
        </div>
      </aside>

      {isPlacingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-32 h-32 md:w-60 md:h-60">
            <AtlazeLoader />
          </div>
        </div>
      )}
    </div>
  );
}
