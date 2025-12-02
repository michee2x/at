"use server"
import type { OrderPayload, CreateOrderResult, WooOrderResponse, WooErrorResponse } from '@/types/checkout';
import { WooOrder } from './user/types';

const WORDPRESS_URL = 'https://atlaze.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY!
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!

export async function createWooOrder(payload: OrderPayload, token?: string): Promise<CreateOrderResult> {
  console.log("api key and secret", WC_CONSUMER_KEY, WC_CONSUMER_SECRET);
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const authToken = Buffer.from(
  `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
).toString("base64");

const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${authToken}`,
  },
  body: JSON.stringify(payload),
  cache: "no-store",
});


    const json = (await res.json()) as WooOrder | WooErrorResponse;

    if (!res.ok) {
      const message = (json as WooErrorResponse).message ?? 'Failed to create order';
      return { success: false, error: String(message) };
    }

    return { success: true, order: json as WooOrder };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network or unexpected error';
    return { success: false, error: msg };
  }
}

// End of document
