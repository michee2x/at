"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { BillingInfo } from "@/types/checkout";
import {
  checkoutSchema,
  type CheckoutSchema,
} from "@/lib/schemas/checkout-form";
import { Mail, Phone, Truck, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CheckoutFormProps {
  defaultValues?: BillingInfo;
  deliveryMethod: "deliver" | "pickup";
  setDeliveryMethod: (m: "deliver" | "pickup") => void;
  loading: boolean;
  onContinue: (
    values: BillingInfo & { deliveryMethod: "deliver" | "pickup" }
  ) => void;
}

export default function CheckoutForm({
  defaultValues,
  onContinue,
  loading = false,
  deliveryMethod,
  setDeliveryMethod,
}: CheckoutFormProps) {
  const form = useForm<CheckoutSchema>({
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

  const selectedDelivery = form.watch("deliveryMethod");

  useEffect(() => {
    if (setDeliveryMethod && selectedDelivery) {
      setDeliveryMethod(selectedDelivery);
    }
  }, [selectedDelivery, setDeliveryMethod]);

  const onSubmit = async (vals: CheckoutSchema) => {
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Delivery Method
            </h2>
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {/* Deliver Option */}
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="deliver"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel className="flex flex-col items-start justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#6a00f3] peer-data-[state=checked]:bg-[#6a00f3]/5 cursor-pointer transition-all">
                          <div className="mb-3 rounded-md bg-white p-2 shadow-sm">
                            <Truck className="h-6 w-6 text-[#6a00f3]" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-900">
                              Deliver It
                            </p>
                            <p className="text-xs text-muted-foreground">
                              We will deliver to your address
                            </p>
                          </div>
                        </FormLabel>
                      </FormItem>

                      {/* Pickup Option */}
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="pickup"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel className="flex flex-col items-start justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#6a00f3] peer-data-[state=checked]:bg-[#6a00f3]/5 cursor-pointer transition-all">
                          <div className="mb-3 rounded-md bg-white p-2 shadow-sm">
                            <Store className="h-6 w-6 text-[#6a00f3]" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-900">
                              Pickup
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Collect from our store
                            </p>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" className="!border !border-solid !border-gray-300 focus-visible:!border-[#6a00f3] focus-visible:!ring-[#6a00f3]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" className="!border !border-solid !border-gray-300 focus-visible:!border-[#6a00f3] focus-visible:!ring-[#6a00f3]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Full street address" className="!border !border-solid !border-gray-300 focus-visible:!border-[#6a00f3] focus-visible:!ring-[#6a00f3]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2 space-y-3 pt-2">
                <FormField
                  control={form.control}
                  name="saveToProfile"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#6a00f3] data-[state=checked]:border-[#6a00f3]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Save this address for later
                        </FormLabel>
                        <FormDescription>
                          Add this to your profile addresses.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9 !border !border-solid !border-gray-300 focus-visible:!border-[#6a00f3] focus-visible:!ring-[#6a00f3]" placeholder="Enter email" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      We&apos;ll send your order confirmation here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9 !border !border-solid !border-gray-300 focus-visible:!border-[#6a00f3] focus-visible:!ring-[#6a00f3]" placeholder="Enter phone number" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Used for delivery updates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#6a00f3] hover:bg-[#5a00d3] h-12 text-lg font-medium"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </div>
          ) : (
            "Continue to Payment"
          )}
        </Button>
      </form>
    </Form>
  );
}
