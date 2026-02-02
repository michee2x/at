"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";
import { revalidatePath } from "next/cache";

export interface DokanCoupon {
  id: number;
  code: string;
  amount: string;
  date_created: string;
  date_expires: string | null;
  discount_type: "percent" | "fixed_cart" | "fixed_product"; // Main types
  description: string;
  usage_count: number;
  usage_limit: number | null;
  individual_use: boolean;
  product_ids: number[];
  excluded_product_ids: number[];
  usage_limit_per_user: number | null;
  limit_usage_to_x_items: number | null;
  free_shipping: boolean;
  exclude_sale_items: boolean;
  minimum_amount: string;
  maximum_amount: string;
  email_restrictions: string[];
  used_by: string[];
}

export interface CreateCouponInput {
  code: string;
  amount: string;
  discount_type: string;
  description?: string;
  expiry_date?: string;
  usage_limit?: number;
  minimum_amount?: string;
  // Add others as needed for the form
}

export async function getVendorCoupons() {
  try {
    const coupons = await dokanRequest<DokanCoupon[]>({
      endpoint: "coupons",
    });
    return coupons;
  } catch (error) {
    console.error("Error fetching vendor coupons:", error);
    return [];
  }
}

export async function createCoupon(data: CreateCouponInput) {
  try {
    const response = await dokanRequest<DokanCoupon>({
      endpoint: "coupons",
      method: "POST",
      body: data,
    });

    revalidatePath("/dashboard/coupons");
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return { success: false, error: error.message || "Failed to create coupon" };
  }
}

export async function deleteCoupon(id: number) {
  try {
    await dokanRequest({
      endpoint: `coupons/${id}`,
      method: "DELETE",
    });

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    return { success: false, error: error.message || "Failed to delete coupon" };
  }
}

export async function updateCoupon(id: number, data: Partial<CreateCouponInput>) {
  try {
    const response = await dokanRequest<DokanCoupon>({
      endpoint: `coupons/${id}`,
      method: "PUT",
      body: data,
    });

    revalidatePath("/dashboard/coupons");
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return { success: false, error: error.message || "Failed to update coupon" };
  }
}
