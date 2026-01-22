"use server"
// WooCommerce API Integration Helper
// This file contains functions to fetch data from WooCommerce/Dokan REST API

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WC_STORE_URL!;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

// Base64 encode credentials for Basic Auth
const authHeader = `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')}`;

/**
 * Fetch vendor dashboard statistics
 * Replace mock data with this function when ready
 */
export async function fetchVendorStats(vendorId: string, dateFrom: string, dateTo: string) {
  try {
    // Example: Fetch sales data
    const salesResponse = await fetch(
      `${WOOCOMMERCE_URL}/wp-json/wc/v3/reports/sales?date_min=${dateFrom}&date_max=${dateTo}`,
      {
        headers: {
          'Authorization': authHeader,
        },
        cache: 'no-store',
      }
    );

    if (!salesResponse.ok) {
      throw new Error('Failed to fetch sales data');
    }

    const salesData = await salesResponse.json();

    // Example: Fetch orders
    const ordersResponse = await fetch(
      `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders?after=${dateFrom}&before=${dateTo}`,
      {
        headers: {
          'Authorization': authHeader,
        },
        cache: 'no-store',
      }
    );

    const ordersData = await ordersResponse.json();

    // Transform data to match your dashboard format
    return {
      totalSales: { value: salesData.total_sales || "0.00", change: 0 },
      marketplaceCommission: { value: "0.00", change: 0 }, // Calculate from Dokan settings
      netSales: { value: salesData.net_sales || "0.00", change: 0 },
      orders: { value: ordersData.length.toString(), change: 0 },
      totalEarning: { value: "0.00", change: 0 },
      marketplaceDiscount: { value: "0.00", change: 0 },
      storeDiscount: { value: "0.00", change: 0 },
      variationsSold: { value: "0", change: 0 },
    };
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    throw error;
  }
}

/**
 * Fetch vendor balance from Dokan
 */
export async function fetchVendorBalance(vendorId: string) {
  try {
    const response = await fetch(
      `${WOOCOMMERCE_URL}/wp-json/dokan/v1/stores/${vendorId}/balance`,
      {
        headers: {
          'Authorization': authHeader,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json();
    return data.balance || "0.00";
  } catch (error) {
    console.error('Error fetching balance:', error);
    return "0.00";
  }
}

/**
 * Fetch chart data for sales/orders over time
 */
export async function fetchChartData(dateFrom: string, dateTo: string) {
  try {
    const response = await fetch(
      `${WOOCOMMERCE_URL}/wp-json/wc/v3/reports/sales?date_min=${dateFrom}&date_max=${dateTo}&period=day`,
      {
        headers: {
          'Authorization': authHeader,
        },
        cache: 'no-store',
      }
    );

    const data = await response.json();

    // Transform to chart format
    return data.map((item: any) => ({
      date: item.date,
      current: parseFloat(item.total_sales),
      previous: 0, // Fetch previous period data separately
    }));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}
