"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DashboardData {
  stats: {
    totalSales: { value: string; change: number };
    marketplaceCommission: { value: string; change: number };
    netSales: { value: string; change: number };
    orders: { value: string; change: number };
    totalEarning: { value: string; change: number };
    marketplaceDiscount: { value: string; change: number };
    storeDiscount: { value: string; change: number };
    variationsSold: { value: string; change: number };
  };
  chartData: Array<{ date: string; current: number; previous: number }>;
  balance: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Month to date (Jan 1 - 21, 2026)");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      console.log('🔄 Fetching dashboard data from /api/dashboard/stats...');
      
      const response = await fetch('/api/dashboard/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      
      console.log('✅ Dashboard data received:', result);
      console.log('📊 Stats:', result.stats);
      console.log('📈 Chart data points:', result.chartData?.length || 0);
      console.log('💰 Balance:', result.balance);
      
      setData(result);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      // Fallback to mock data if API fails
      setData({
        stats: {
          totalSales: { value: "0.00", change: 0 },
          marketplaceCommission: { value: "0.00", change: 0 },
          netSales: { value: "0.00", change: 0 },
          orders: { value: "0", change: 0 },
          totalEarning: { value: "0.00", change: 0 },
          marketplaceDiscount: { value: "0.00", change: 0 },
          storeDiscount: { value: "0.00", change: 0 },
          variationsSold: { value: "0", change: 0 },
        },
        chartData: [],
        balance: "0.00",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Balance and Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Balance:</p>
            <p className="text-2xl font-bold text-primary">₦{data.balance}</p>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div>
        <label className="text-sm font-medium mb-2 block">Date range:</label>
        <Button variant="outline" className="w-full sm:w-auto justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          {dateRange}
        </Button>
      </div>

      {/* Performance Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance</h2>
        
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total sales"
            value={data.stats.totalSales.value}
            change={data.stats.totalSales.change}
            currency
          />
          <StatCard
            title="Marketplace Commission"
            value={data.stats.marketplaceCommission.value}
            change={data.stats.marketplaceCommission.change}
            currency
          />
          <StatCard
            title="Net sales"
            value={data.stats.netSales.value}
            change={data.stats.netSales.change}
            currency
          />
          <StatCard
            title="Orders"
            value={data.stats.orders.value}
            change={data.stats.orders.change}
          />
          <StatCard
            title="Total Earning"
            value={data.stats.totalEarning.value}
            change={data.stats.totalEarning.change}
            currency
          />
          <StatCard
            title="Marketplace Discount"
            value={data.stats.marketplaceDiscount.value}
            change={data.stats.marketplaceDiscount.change}
            currency
          />
          <StatCard
            title="Store Discount"
            value={data.stats.storeDiscount.value}
            change={data.stats.storeDiscount.change}
            currency
          />
          <StatCard
            title="Variations Sold"
            value={data.stats.variationsSold.value}
            change={data.stats.variationsSold.change}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Charts</h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart
            data={data.chartData}
            title="Net sales"
            currentLabel="Month to date (Jan 1 - 21, 2026)"
            previousLabel="Previous year (Jan 1 - 21, 2025)"
          />
          <SalesChart
            data={data.chartData}
            title="Orders"
            currentLabel="Month to date (Jan 1 - 21, 2026)"
            previousLabel="Previous year (Jan 1 - 21, 2025)"
          />
        </div>
      </div>
    </div>
  );
}
