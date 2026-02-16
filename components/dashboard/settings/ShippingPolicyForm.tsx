"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { shippingPolicySchema, type ShippingPolicyValues } from "@/lib/schemas/shipping";
import { updateShippingPolicy } from "@/lib/actions/dashboard/shipping";

interface ShippingPolicyFormProps {
  initialData?: ShippingPolicyValues;
}

const processingTimes = [
  { value: "1", label: "1 business day" },
  { value: "2", label: "1-2 business days" },
  { value: "3", label: "1-3 business days" },
  { value: "4", label: "3-5 business days" },
  { value: "5", label: "1-2 weeks" },
  { value: "6", label: "2-3 weeks" },
  { value: "7", label: "3-4 weeks" },
  { value: "8", label: "4-6 weeks" },
  { value: "9", label: "6-8 weeks" },
];

export function ShippingPolicyForm({ initialData }: ShippingPolicyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ShippingPolicyValues>({
    resolver: zodResolver(shippingPolicySchema),
    defaultValues: {
      processing_time: initialData?.processing_time || "",
      shipping_policy: initialData?.shipping_policy || "",
      refund_policy: initialData?.refund_policy || "",
    },
  });

  async function onSubmit(data: ShippingPolicyValues) {
    setIsSubmitting(true);
    try {
      const result = await updateShippingPolicy(data);

      if (result.success) {
        toast.success("Policy settings updated successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Shipping Policy</CardTitle>
                <CardDescription>
                    Configure your store's shipping and refund policies.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                control={form.control}
                name="processing_time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Processing Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select processing time" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {processingTimes.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                            {item.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        The time it takes for you to prepare the order for shipment.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="shipping_policy"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Shipping Policy</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Enter your shipping policy here..."
                        className="min-h-[150px]"
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Details about how you ship your products.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="refund_policy"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Refund Policy</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Enter your refund policy here..."
                        className="min-h-[150px]"
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Details about your return and refund policy.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
