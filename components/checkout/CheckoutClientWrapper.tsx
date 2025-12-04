"use client";

import { useState } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/sections/cart/OrderSummary";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <section className="w-full">
        <CheckoutForm
          defaultValues={defaultBilling}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          loading={isPlacingOrder}
          onContinue={handleContinue}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </section>

      <aside>
        <OrderSummary
          showCheckoutButton={false}
          deliveryMethod={deliveryMethod}
        />
      </aside>
    </div>
  );
}
