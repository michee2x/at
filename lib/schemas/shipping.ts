import { z } from "zod";

export const shippingPolicySchema = z.object({
    processing_time: z.string().optional(),
    shipping_policy: z.string().optional(),
    refund_policy: z.string().optional(),
});

export type ShippingPolicyValues = z.infer<typeof shippingPolicySchema>;
