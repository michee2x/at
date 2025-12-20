"use server"

import { wooCommerceRequest } from "@/lib/dashboard/woocomerce";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { WooOrder } from "@/lib/user/types";

export interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  line_items: Array<{
    name: string;
    quantity: number;
    total: string;
  }>;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
  };
}

export async function getOrders(page = 1, perPage = 10) {
  const session = await getServerSession(authOptions);
  console.log("this is the session in orders action: ", session);

  try {
    if (!session?.user?.id) {
   throw new Error("you are not logged in in get Orders action")
  }
    const orders = await wooCommerceRequest<WooOrder[]>({
      endpoint: `orders?per_page=${perPage}&page=${page}&orderby=date&order=desc`,
      customerId: parseInt(session.user.id),
    });

    return {
      orders,
      total: orders.length,
      pages: Math.ceil(orders.length / perPage),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], total: 0, pages: 0 };
  }
}

export async function getOrder(orderId: number) {
  try {
    return await wooCommerceRequest<Order>({
      endpoint: `orders/${orderId}`,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}