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
saveToProfile?: boolean;
preferredAddress?: boolean;
email: string;
phone: string;
}


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