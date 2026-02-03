"use client";

import { useState, useEffect } from "react";
import { getProductStats, getChartData, getProductsReport } from "@/lib/actions/dashboard/product-reports";
import { StatsCards } from "@/components/dashboard/product-reports/StatsCards";
import { ItemsSoldChart } from "@/components/dashboard/product-reports/ItemsSoldChart";
import { ProductsTable } from "@/components/dashboard/product-reports/ProductsTable";
import { DateRangePicker } from "@/components/dashboard/product-reports/DateRangePicker";

export default function ProductReportsPage() {
    const [stats, setStats] = useState({ items_sold: 0, net_revenue: 0, orders_count: 0 });
    const [chartData, setChartData] = useState<Array<{ date: string; items: number }>>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({
        after: "2026-02-01T00:00:00",
        before: "2026-02-03T23:59:59",
    });

    useEffect(() => {
        fetchAllData();
    }, [dateRange]);

    const fetchAllData = async () => {
        try {
            const [statsData, chartDataRes, productsData] = await Promise.all([
                getProductStats(dateRange.after, dateRange.before),
                getChartData(dateRange.after, dateRange.before),
                getProductsReport(),
            ]);

            setStats(statsData);
            setChartData(chartDataRes);
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const handleDateChange = (after: string, before: string) => {
        setDateRange({ after, before });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reports</h1>
            
            <DateRangePicker onDateChange={handleDateChange} />
            
            <StatsCards 
                itemsSold={stats.items_sold}
                netRevenue={stats.net_revenue}
                ordersCount={stats.orders_count}
            />
            
            <ItemsSoldChart data={chartData} />
            
            <ProductsTable products={products} />
        </div>
    );
}
