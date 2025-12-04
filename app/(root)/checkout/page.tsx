"use client";

import React, { useEffect, useState } from "react";
import type { BillingInfo } from "@/types/checkout";
import { toNumber } from "@/utils/to-number";
import { getUserDetailsAction } from "@/lib/actions/UserAction";
import { getServerSessionFromAPI } from "@/utils/getServerSessionFromAPI";
import { CheckoutClientWrapper } from "@/components/checkout/CheckoutClientWrapper";
import { useAuth } from "@/contexts/auth-context";
import CheckoutFormSkeleton from "@/components/skeletons/CheckoutFormSkeleton";

export default function CheckoutPage() {
  const {session} = useAuth()
  const [defaultBilling, setDefaultBilling] = useState<BillingInfo | undefined>(
    undefined
  );

  // 1️⃣ Fetch session on client
  useEffect(() => {
    async function fetchSession() {
      console.log("This is the session in checkout page: ", session);

      if (session?.user?.id) {
        const id = toNumber(session.user.id);

        // 2️⃣ Fetch user billing info
        const user = await getUserDetailsAction(id);

        if (user?.billing) {
          setDefaultBilling({
            firstName: user.billing.first_name || "",
            lastName: user.billing.last_name || "",
            addressLine1: user.billing.address_1 || "",
            addressLine2: user.billing.address_2 || "",
            email: user.billing.email || "",
            phone: user.billing.phone || "",
            saveToProfile: false,
            preferredAddress: true,
          });
        }

        console.log("this is the user billing info: ", user?.billing);
      }
    }

    fetchSession();
  }, [session?.user]);


  console.log("this is the default billing info: ", defaultBilling)

  return (
    <main className="mt-[20px] px-4 lg:px-[70px] min-h-[100vh]">
      {defaultBilling ? (
        <CheckoutClientWrapper defaultBilling={defaultBilling} />
      ) : (
        <CheckoutFormSkeleton />
      )}
    </main>
  );
}
