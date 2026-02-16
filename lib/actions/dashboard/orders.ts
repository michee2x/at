"use server"

import { wooCommerceRequest } from "@/lib/dashboard/woocomerce";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { WooOrder, VendorOrderDisplay } from "@/lib/user/types";

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

export interface OrderFilters {
  search?: string;
  status?: string;
  dateStart?: string;
  dateEnd?: string;
  customerId?: string;
}

export interface OrdersResponse {
  orders: VendorOrderDisplay[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Marketplace commission rate (10% default, adjust as needed)
const MARKETPLACE_COMMISSION_RATE = 0.10;

function calculateVendorEarning(total: string): string {
  const totalAmount = parseFloat(total);
  const commission = totalAmount * MARKETPLACE_COMMISSION_RATE;
  const earning = totalAmount - commission;
  return earning.toFixed(2);
}

import { dokanRequest } from "@/lib/dashboard/dokan";

// Define local interface for Dokan Order to handle net_sales without modifying global types
interface DokanOrder extends WooOrder {
  net_sales?: string;
}

function transformToVendorDisplay(order: WooOrder): VendorOrderDisplay {
  const dokanOrder = order as DokanOrder;
  // Use net_sales if available and not "0.00", otherwise calculate manually
  const hasNetSales = dokanOrder.net_sales && dokanOrder.net_sales !== "0.00";
  const earning = hasNetSales ? dokanOrder.net_sales! : calculateVendorEarning(order.total);

  return {
    id: order.id,
    orderNumber: order.number || `#${order.id}`,
    total: order.total,
    earning: earning,
    status: order.status,
    date: order.date_created || "",
    currency: order.currency,
  };
}

export async function getVendorOrders(
  page = 1,
  perPage = 10,
  filters: OrderFilters = {}
): Promise<OrdersResponse> {
  // session check handled inside dokanRequest now (mostly), but good to keep basic check if needed or rely on dokanRequest throwing.
  // Actually, dokanRequest does getSession.

  try {
    // Build query parameters
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      orderby: "date",
      order: "desc",
    });

    // Add filters
    if (filters.status && filters.status !== "all") {
      params.append("status", filters.status);
    }

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.dateStart) {
      params.append("after", filters.dateStart);
    }

    if (filters.dateEnd) {
      params.append("before", filters.dateEnd);
    }

    if (filters.customerId) {
      params.append("customer", filters.customerId);
    }

    // Note: No need to append seller_id, as JWT token identifies the vendor

    const orders = await dokanRequest<WooOrder[]>({
      endpoint: `orders?${params.toString()}`,
    });

    // Dokan usually returns X-WP-Total header for total count, 
    // but wooCommerceRequest/dokanRequest here returns JSON body.
    // If Dokan returns array directly (which it does for orders endpoint), we can just map.
    // Pagination total might be missing if we don't return headers. For now, use array length or fetched size.
    // Ideally, we'd need headers. dokanRequest returns JSON. 
    // Given usage, let's assume simple pagination for now (next page until empty).

    // Transform orders to vendor display format
    const vendorOrders = orders.map(transformToVendorDisplay);

    return {
      orders: vendorOrders,
      total: orders.length, // Placeholder logic (Dokan header usually has total, would need to update request helper to return headers if critical)
      totalPages: Math.ceil(orders.length / perPage) || 1, // Fallback
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return { orders: [], total: 0, totalPages: 0, currentPage: 1 };
  }
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