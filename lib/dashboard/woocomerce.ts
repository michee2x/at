// ==========================================
// lib/woocommerce.ts
// ==========================================
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || "";
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || "";

interface WooCommerceRequest {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  customerId?: number;
}

export async function wooCommerceRequest<T>({
  endpoint,
  method = "GET",
  body,
  customerId,
}: WooCommerceRequest): Promise<T> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const url = new URL(`${WC_API_URL || "https://api.atlaze.com"}/wp-json/wc/v3/${endpoint}`);
  url.searchParams.append("consumer_key", WC_CONSUMER_KEY);
  url.searchParams.append("consumer_secret", WC_CONSUMER_SECRET);

  if (customerId) {
    url.searchParams.append("customer", customerId.toString());
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.statusText}`);
  }

  return response.json();
}