// lib/user/User.ts
import { UserBillingInfo } from "@/types/checkout";
import { WooOrder, UserOptions } from "./types";
import { Customer } from "@/types";

export class User {
  private id: number;
  private wpUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor(options: UserOptions) {
    this.id = options.id;
    this.wpUrl = process.env.WORDPRESS_URL! || "https://api.atlaze.com";
    this.consumerKey = process.env.WC_CONSUMER_KEY!;
    this.consumerSecret = process.env.WC_CONSUMER_SECRET!;
  }

  private get authHeader() {
    const token = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString("base64");

    return `Basic ${token}`;
  }

  /**
   * Fetch all WooCommerce orders for this user
   */
  async getOrders(): Promise<WooOrder[]> {
    const url = `${this.wpUrl}/wp-json/wc/v3/orders?customer=${this.id}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Orders fetch error:", await res.text());
      throw new Error("Failed to load orders for user");
    }

    return res.json();
  }

  /**
   * Fetch a single WooCommerce order by its ID
   */
  async getOrderById(orderId: number): Promise<WooOrder> {
    const url = `${this.wpUrl}/wp-json/wc/v3/orders/${orderId}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Single order fetch error:", await res.text());
      throw new Error(`Failed to load order with ID ${orderId}`);
    }

    return res.json();
  }

  /**
   * Update user details
   */
  async updateUser(data: UserBillingInfo): Promise<void> {
    const url = `${this.wpUrl}/wp-json/wc/v3/customers/${this.id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({billing: data}),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("User update error:", await res.text());
      throw new Error("Failed to update user details");
    }

    return res.json();
  }

  /**
   * Fetch user details
   */
  async getUserDetails(): Promise<Customer> {
    const url = `${this.wpUrl}/wp-json/wc/v3/customers/${this.id}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("User fetch error:", await res.text());
      throw new Error("Failed to fetch user details");
    }
    return res.json();
  }
}
