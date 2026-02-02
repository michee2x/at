// lib/user/types.ts

import { WooProductImage } from "@/types";

export interface WooOrderItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
  image: WooProductImage | null;
}

export interface WooOrder {
  id: number;
  status: string;
  currency: string;
  total: string;
  line_items: WooOrderItem[];
  order_key: string;
  billing: WooBilling;
  number?: string;
  date_created?: string;
  payment_method_title?: string;
  customer_id?: number;
  date_modified?: string;
  shipping?: WooShipping;
  meta_data?: Array<{
    key: string;
    value: string | number;
  }>;
}

export interface WooShipping {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
}

// Helper type for vendor order display
export interface VendorOrderDisplay {
  id: number;
  orderNumber: string;
  total: string;
  earning: string;
  status: string;
  date: string;
  currency: string;
}

export interface UserOptions {
  id: number; // WooCommerce customer ID
}

export interface WooBilling {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  email: string;
  phone: string;
}