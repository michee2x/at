import { NextResponse } from 'next/server';

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WC_STORE_URL!;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

// Create Basic Auth header
const authHeader = `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')}`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dateTo = searchParams.get('to') || new Date().toISOString().split('T')[0];

  console.log('📅 Dashboard API called with date range:', { dateFrom, dateTo });
  console.log('🔗 WooCommerce URL:', WOOCOMMERCE_URL);
  console.log('🔑 Has credentials:', {
    hasKey: !!CONSUMER_KEY,
    hasSecret: !!CONSUMER_SECRET
  });

  try {
    // Fetch sales reports from WooCommerce
    const salesUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/reports/sales?date_min=${dateFrom}&date_max=${dateTo}`;

    console.log('📊 Fetching sales from:', salesUrl);

    const salesResponse = await fetch(salesUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!salesResponse.ok) {
      const errorText = await salesResponse.text();
      console.error('❌ WooCommerce sales API error:', salesResponse.status, salesResponse.statusText);
      console.error('❌ Error response body:', errorText);
      throw new Error(`WooCommerce API error: ${salesResponse.statusText} - ${errorText}`);
    }

    const salesData = await salesResponse.json();
    console.log('✅ Sales data received:', salesData);

    // Fetch orders for order count
    const ordersUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders?after=${dateFrom}T00:00:00&before=${dateTo}T23:59:59&per_page=100`;

    console.log('📦 Fetching orders from:', ordersUrl);

    const ordersResponse = await fetch(ordersUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const ordersData = await ordersResponse.json();
    console.log('✅ Orders data received:', ordersData.length, 'orders');

    // Calculate statistics from the summary object
    const reportSummary = salesData[0] || {};
    const totalSales = parseFloat(reportSummary.total_sales || 0);
    const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;
    const totalItems = parseInt(reportSummary.total_items || 0);

    // Calculate commission (example: 10% marketplace fee)
    const commissionRate = 0.10;
    const marketplaceCommission = totalSales * commissionRate;
    const netSales = totalSales - marketplaceCommission;

    console.log('💰 Calculated stats:', {
      totalSales,
      totalOrders,
      totalItems,
      marketplaceCommission,
      netSales
    });

    // Format chart data - iterate over the totals object which contains daily data
    const dailyTotals = reportSummary.totals || {};
    const chartData = Object.keys(dailyTotals).map(dateKey => {
      const dayData = dailyTotals[dateKey];
      // Structure: dayData is { sales: "0.00", orders: 0, items: 0 ... }
      return {
        date: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        current: parseFloat(dayData.sales || dayData.total_sales || 0),
        previous: 0, 
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ensure sorted by date

    console.log('📈 Chart data formatted:', chartData.length, 'data points');

    const responseData = {
      stats: {
        totalSales: { value: totalSales.toFixed(2), change: 0 },
        marketplaceCommission: { value: marketplaceCommission.toFixed(2), change: 0 },
        netSales: { value: netSales.toFixed(2), change: 0 },
        orders: { value: totalOrders.toString(), change: 0 },
        totalEarning: { value: netSales.toFixed(2), change: 0 },
        marketplaceDiscount: { value: "0.00", change: 0 },
        storeDiscount: { value: "0.00", change: 0 },
        variationsSold: { value: totalItems.toString(), change: 0 },  
      },
      chartData,
      balance: netSales.toFixed(2),
    };

    console.log('✅ Sending response:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
