"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { BillingInfo } from "@/types/checkout";
import {
  checkoutSchema,
  type CheckoutSchema,
} from "@/lib/schemas/checkout-form";
import { useCheckout } from "@/hooks/useCheckout";

interface CheckoutFormProps {
  defaultValues?: BillingInfo;
  deliveryMethod: "deliver" | "pickup";
  setDeliveryMethod: (m: "deliver" | "pickup") => void;
  loading: boolean;
  onContinue: (
    values: BillingInfo & { deliveryMethod: "deliver" | "pickup" }
  ) => void;
}

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-sm font-medium mb-1">{children}</label>
);

const HelperText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs text-gray-500 mt-1">{children}</p>
);

export default function CheckoutForm({
  defaultValues,
  onContinue,
  loading = false,
  deliveryMethod,
  setDeliveryMethod
}: CheckoutFormProps) {
  const { register, handleSubmit, formState, watch } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: deliveryMethod ?? "deliver",
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      addressLine2: defaultValues?.addressLine2 ?? "",
      saveToProfile: defaultValues?.saveToProfile ?? false,
      preferredAddress: defaultValues?.preferredAddress ?? false,
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
    },
    mode: "onChange",
  });

  const { errors, isValid } = formState;
  const selectedDelivery = watch("deliveryMethod");

  const submit = handleSubmit(async (vals) => {
    await onContinue({
      firstName: vals.firstName,
      lastName: vals.lastName,
      addressLine2: vals.addressLine2,
      saveToProfile: vals.saveToProfile,
      preferredAddress: vals.preferredAddress,
      email: vals.email,
      phone: vals.phone,
      deliveryMethod: vals.deliveryMethod,
    });
  });

useEffect(() => {
  if (setDeliveryMethod) {
    setDeliveryMethod(selectedDelivery);
  }
}, [selectedDelivery]);


  return (
    <form onSubmit={submit} className="space-y-6">
      <h2 className="text-lg font-semibold">
        How would you like to get your order?
      </h2>

      <div className="flex gap-3">
        {/* Deliver */}
        <label
          className={`flex-1 border rounded-lg p-4 cursor-pointer ${
            selectedDelivery === "deliver" ? "ring-2 ring-black" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              value="deliver"
              {...register("deliveryMethod")}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">Deliver It</div>
              <div className="text-sm text-gray-500">
                We will deliver to your address
              </div>
            </div>
          </div>
        </label>

        {/* Pickup */}
        <label
          className={`flex-1 border rounded-lg p-4 cursor-pointer ${
            selectedDelivery === "pickup" ? "ring-2 ring-black" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              value="pickup"
              {...register("deliveryMethod")}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">Pickup</div>
              <div className="text-sm text-gray-500">Collect from store</div>
            </div>
          </div>
        </label>
      </div>

      <hr />

      <div>
        <FieldLabel>Enter your name and address:</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              {...register("firstName")}
              placeholder="First Name"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.lastName ? "border-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <input
              {...register("addressLine2")}
              placeholder="Address Line 2"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.addressLine2 ? "border-red-500" : ""
              }`}
            />
            {errors.addressLine2 && (
              <p className="text-xs text-red-500 mt-1">
                {errors.addressLine2.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="inline-flex items-center gap-2">
              <input
                {...register("saveToProfile")}
                type="checkbox"
                className="w-4 h-4"
              />
              <span className="text-sm">Save this address to my profile</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                {...register("preferredAddress")}
                type="checkbox"
                className="w-4 h-4"
              />
              <span className="text-sm">Make this my preferred address</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>What&apos;s your contact information?</FieldLabel>
        <div className="space-y-3">
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            <HelperText>
              A confirmation email will be sent after checkout.
            </HelperText>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("phone")}
              placeholder="Phone Number"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            <HelperText>
              A carrier might contact you to confirm delivery.
            </HelperText>
            {errors.phone && (
              <p className="text-xs pl-4 text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full bg-blue-600 disabled:bg-gray-200 disabled:text-gray-600 text-gray-50 py-3 rounded disabled:opacity-60"
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </form>
  );
}

//   defaultBilling,
// }: {
//   defaultBilling: BillingInfo | undefined;
// }) => {
//   const { isPlacingOrder, error, placeOrder } = useCheckout();
//   const handleContinue = async (
//     values: BillingInfo & { deliveryMethod?: "deliver" | "pickup" }
//   ) => {
//     await placeOrder(values);
//   };
//   return (
//     <section className="w-full">
//       <CheckoutForm
//         onContinue={handleContinue}
//         loading={isPlacingOrder}
//         defaultValues={defaultBilling}
//       />

//       {error && <div className="text-sm text-red-500 mt-3">{error}</div>}
//     </section>
//   );
// };