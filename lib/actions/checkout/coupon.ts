"use server";

import { WCCoupon } from "@/types/checkout";

const WORDPRESS_URL = "https://api.atlaze.com";
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

interface ValidateCouponResult {
  success: boolean;
  coupon?: WCCoupon;
  error?: string;
  discountAmount?: number;
}

export async function validateCoupon(
  code: string,
  cartTotal: number,
  cartItems: { id: number; quantity: number; price: number }[]
): Promise<ValidateCouponResult> {
  try {
    const authToken = Buffer.from(
      `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wc/v3/coupons?code=${code}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return { success: false, error: "Invalid coupon code" };
    }

    const coupons: WCCoupon[] = await response.json();

    if (coupons.length === 0) {
      return { success: false, error: "Invalid coupon code" };
    }

    const coupon = coupons[0];

    // 1. Check Expiry
    if (coupon.date_expires) {
      const expiryDate = new Date(coupon.date_expires);
      if (expiryDate < new Date()) {
        return { success: false, error: "Coupon has expired" };
      }
    }

    // 2. Check Usage Limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { success: false, error: "Coupon usage limit reached" };
    }

    // 3. Check Minimum Spend
    if (Number(coupon.minimum_amount) > 0 && cartTotal < Number(coupon.minimum_amount)) {
        return { success: false, error: `Minimum spend of ₦${coupon.minimum_amount} required` };
    }

    // 4. Check Maximum Spend
    if (Number(coupon.maximum_amount) > 0 && cartTotal > Number(coupon.maximum_amount)) {
        return { success: false, error: `Maximum spend of ₦${coupon.maximum_amount} exceeded` };
    }

    // 5. Calculate Discount (Simple implementation for UI purposes)
    // NOTE: Real calculation happens in WC when order is created, this is for UI estimation.
    let discount = 0;
    
    // Check product requirements
    const productIdsInCart = cartItems.map(item => item.id);
    
    // If coupon has product restrictions, ensure at least one valid product is in cart
    if (coupon.product_ids.length > 0) {
        const hasValidProduct = cartItems.some(item => coupon.product_ids.includes(item.id));
        if (!hasValidProduct) {
            return { success: false, error: "Coupon is not valid for items in your cart" };
        }
    }

    // If coupon has excluded products, ensure no excluded product is in cart (or just warn? standard WC behavior is strict)
    // Actually standard WC behavior is complex (it might just not apply discount to those items).
    // For simplicity in this UI estimation, we'll try to calculate logic.

    if (coupon.discount_type === 'percent') {
        // Apply to eligible items
        const percentage = Number(coupon.amount) / 100;
        
        let eligibleTotal = 0;
        cartItems.forEach(item => {
             // Check if item is excluded
             if (coupon.excluded_product_ids.includes(item.id)) return;
             
             // Check if item is included (if product_ids is set)
             if (coupon.product_ids.length > 0 && !coupon.product_ids.includes(item.id)) return;
             
             eligibleTotal += item.price * item.quantity;
        });
        
        discount = eligibleTotal * percentage;

    } else if (coupon.discount_type === 'fixed_cart') {
        discount = Number(coupon.amount);
    } else if (coupon.discount_type === 'fixed_product') {
        const amount = Number(coupon.amount);
        cartItems.forEach(item => {
             // Check if item is excluded
             if (coupon.excluded_product_ids.includes(item.id)) return;
             
             // Check if item is included (if product_ids is set)
             if (coupon.product_ids.length > 0 && !coupon.product_ids.includes(item.id)) return;
             
             discount += amount * item.quantity;
        });
    }

    // Cap discount at cart total
    discount = Math.min(discount, cartTotal);

    return {
      success: true,
      coupon,
      discountAmount: discount,
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { success: false, error: "Failed to validate coupon" };
  }
}
