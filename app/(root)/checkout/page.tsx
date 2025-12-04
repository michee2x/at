import React from "react";
import type { BillingInfo } from "@/types/checkout";
import { toNumber } from "@/utils/to-number";
import { getUserDetailsAction } from "@/lib/actions/UserAction";
import { getServerSessionFromAPI } from "@/utils/getServerSessionFromAPI";
import { CheckoutClientWrapper } from "@/components/checkout/CheckoutClientWrapper";

export default async function CheckoutPage() {
  // 1️⃣ Get session on server
   const session = await getServerSessionFromAPI();
 
   if (!session?.user) {
     return <div className="p-6 text-red-600">You are not signed in</div>;
   }
 
   const customerId = toNumber(session.user.id);

  let defaultBilling: BillingInfo | undefined = undefined;

  // 2️⃣ Fetch user billing on server
  if (customerId) {
    const user = await getUserDetailsAction(customerId);

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
    <main className="mt-[20px] px-4 lg:px-[70px] min-h-[100vh]">
      <CheckoutClientWrapper defaultBilling={defaultBilling} />
    </main>
  );
}
