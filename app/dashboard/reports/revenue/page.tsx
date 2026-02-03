"use client";

import { useState, useEffect } from "react";
import { getRevenueStats } from "@/lib/actions/dashboard/revenue-reports";
import { RevenueStatsCards } from "@/components/dashboard/revenue-reports/RevenueStatsCards";
import { GrossSalesChart } from "@/components/dashboard/revenue-reports/GrossSalesChart";
import { RevenueTable } from "@/components/dashboard/revenue-reports/RevenueTable";
import { DateRangePicker } from "@/components/dashboard/product-reports/DateRangePicker";

export default function RevenueReportsPage() {
    const [totals, setTotals] = useState({
        orders_count: 0,
        gross_sales: 0,
        total_sales: 0,
        refunds: 0,
        coupons: 0,
        taxes: 0,
        shipping: 0,
        net_revenue: 0,
    });
    const [chartData, setChartData] = useState<Array<{ date: string; gross_sales: number }>>([]);
    const [intervals, setIntervals] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({
        after: "2026-02-01T00:00:00",
        before: "2026-02-03T23:59:59",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRevenueData();
    }, [dateRange]);

    const fetchRevenueData = async () => {
        setIsLoading(true);
        try {
            const data = await getRevenueStats(dateRange.after, dateRange.before);
            setTotals(data.totals);
            setChartData(data.chartData);
            setIntervals(data.intervals);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (after: string, before: string) => {
        setDateRange({ after, before });
    };

    const calculatePeriod = () => {
        const start = new Date(dateRange.after);
        const end = new Date(dateRange.before);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Revenue</h1>
            
            <DateRangePicker onDateChange={handleDateChange} isLoading={isLoading} />
            
            <RevenueStatsCards
                grossSales={totals.gross_sales}
                returns={totals.refunds}
                coupons={totals.coupons}
                netSales={totals.net_revenue}
                taxes={totals.taxes}
                shipping={totals.shipping}
            />
            
            <GrossSalesChart data={chartData} />
            
            <RevenueTable intervals={intervals} />
            
            <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Period</div>
                        <div className="text-base font-medium">{calculatePeriod()}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Orders</div>
                        <div className="text-base font-medium">{totals.orders_count}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Gross Sales</div>
                        <div className="text-base font-medium">₦{totals.gross_sales.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Returns</div>
                        <div className="text-base font-medium">₦{totals.refunds.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Coupons</div>
                        <div className="text-base font-medium">₦{totals.coupons.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Net Sales</div>
                        <div className="text-base font-medium">₦{totals.net_revenue.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Taxes</div>
                        <div className="text-base font-medium">₦{totals.taxes.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Shipping</div>
                        <div className="text-base font-medium">₦{totals.shipping.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
