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