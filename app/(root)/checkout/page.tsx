import React from "react";
import type { BillingInfo } from "@/types/checkout";
import { toNumber } from "@/utils/to-number";
import { getUserDetailsAction } from "@/lib/actions/UserAction";
import { getServerSessionFromAPI } from "@/utils/getServerSessionFromAPI";
import { CheckoutClientWrapper } from "@/components/checkout/CheckoutClientWrapper";

export default async function CheckoutPage() {
  const session = await getServerSessionFromAPI();
  let defaultBilling: BillingInfo | undefined = undefined;

  if (session?.user?.id) {
    const id = toNumber(session.user.id);
    const user = await getUserDetailsAction(id);

    if (user?.billing) {
      defaultBilling = {
        firstName: user.billing.first_name || "",
        lastName: user.billing.last_name || "",
        addressLine1: user.billing.address_1 || "",
        addressLine2: user.billing.address_2 || "",
        email: user.billing.email || "",
        phone: user.billing.phone || "",
        saveToProfile: false,
        preferredAddress: true,
      };
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>
      <div className="max-w-6xl">
        <CheckoutClientWrapper defaultBilling={defaultBilling} />
      </div>
    </main>
  );
}
