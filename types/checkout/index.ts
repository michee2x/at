import { WooOrder } from "@/lib/user/types";

export type Country = 'NG' | 'US' | 'GB' | string;


export interface WooProductToCartItem {
  id: number;
  name: string;
  price: number; // numeric price (not string)
  quantity: number;
  variation?: Record<string, unknown>;
}


export interface Cart {
  items: WooProductToCartItem[];
  total: number;
  updatedAt?: string;
}


export interface BillingInfo {
  firstName: string;
  lastName: string;
  addressLine2?: string;
  addressLine1?: string;
  saveToProfile?: boolean;
  preferredAddress?: boolean;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: Country;
  deliveryMethod?: "deliver";
}

export type UserBillingInfo = Omit<BillingInfo, "addressLine1" | "addressLine2" | "firstName" | "lastName"> & {
  first_name: string;
  last_name: string;
  address_1?: string;
  address_2?: string;
};


export interface OrderLineItem {
  product_id: number;
  quantity: number;
}


export interface OrderPayload {
  payment_method: string;
  payment_method_title?: string;
  set_paid?: boolean;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    country?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    country?: string;
  };
  line_items: OrderLineItem[];
  customer_id?: number;
}


export interface WooOrderResponse {
  id: number;
  number?: string;
  status?: string;
  total?: string;
  [key: string]: unknown;
}


export interface WooErrorResponse {
  code?: string;
  message?: string;
  data?: unknown;
}


export type CreateOrderResult =
| { success: true; order: WooOrder }
  | { success: false; error: string };


export interface CouponLine {
  code: string;
  amount?: string;
  discount?: string;
  meta_data?: { key: string; value: string }[];
}

export interface WCCoupon {
  id: number;
  code: string;
  amount: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_type: "percent" | "fixed_cart" | "fixed_product";
  description: string;
  date_expires: string | null;
  date_expires_gmt: string | null;
  usage_count: number;
  individual_use: boolean;
  product_ids: number[];
  excluded_product_ids: number[];
  usage_limit: number | null;
  usage_limit_per_user: number | null;
  limit_usage_to_x_items: number | null;
  free_shipping: boolean;
  product_categories: number[];
  excluded_product_categories: number[];
  exclude_sale_items: boolean;
  minimum_amount: string;
  maximum_amount: string;
  email_restrictions: string[];
  used_by: string[];
  meta_data: { id: number; key: string; value: string }[];
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  couponData: WCCoupon;
}
