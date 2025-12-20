"use server"

import { wooCommerceRequest } from "@/lib/dashboard/woocomerce";
import { revalidatePath } from "next/cache";

export interface Refund {
  id: number;
  date_created: string;
  amount: string;
  reason: string;
  refunded_by: number;
  line_items: Array<{
    name: string;
    product_id: number;
    quantity: number;
    refund_total: string;
  }>;
}

export async function getRefunds(orderId: number) {
  try {
    return await wooCommerceRequest<Refund[]>({
      endpoint: `orders/${orderId}/refunds`,
    });
  } catch (error) {
    console.error("Error fetching refunds:", error);
    return [];
  }
}

export async function createRefund(
  orderId: number,
  amount: string,
  reason: string
) {
  try {
    const result = await wooCommerceRequest<Refund>({
      endpoint: `orders/${orderId}/refunds`,
      method: "POST",
      body: {
        amount,
        reason,
      },
    });

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/returns");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating refund:", error);
    return { success: false, error: "Failed to create refund" };
  }
}