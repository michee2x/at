"use client";

import { useState, useEffect } from "react";
import { 
    getCategoriesReport, 
    getCategoryProducts, 
    getCategoryStats,
    CategoryReport, 
    CategoryProductReport 
} from "@/lib/actions/dashboard/categories-reports";
import { CategoriesStats } from "@/components/dashboard/categories-reports/CategoriesStats";
import { CategoriesChart } from "@/components/dashboard/categories-reports/CategoriesChart";
import { CategoriesTable } from "@/components/dashboard/categories-reports/CategoriesTable";
import { ReportProductsTable } from "@/components/dashboard/categories-reports/ReportProductsTable";
import { CategoryFilter } from "@/components/dashboard/categories-reports/CategoryFilter";
import { DateRangePicker } from "@/components/dashboard/product-reports/DateRangePicker";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesReportsPage() {
    // Main data
    const [categories, setCategories] = useState<CategoryReport[]>([]);
    
    // Single Category Mode Data
    const [categoryProducts, setCategoryProducts] = useState<CategoryProductReport[]>([]);
    const [singleCategoryStats, setSingleCategoryStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    
    // UI State
    const [filterMode, setFilterMode] = useState("all");
    const [selectedCategories, setSelectedCategories] = useState<CategoryReport[]>([]);
    const [dateRange, setDateRange] = useState({
        after: "2026-02-01T00:00:00",
        before: "2026-02-04T23:59:59",
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial categories list
    useEffect(() => {
        fetchMainCategories();
    }, [dateRange]);

    // Fetch single category details when selection changes
    useEffect(() => {
        if (filterMode === "single" && selectedCategories.length === 1) {
            fetchSingleCategoryData(selectedCategories[0].category_id);
        } else {
            // Reset to default chart data if not in single mode
            const defaultChartData = categories.map(cat => ({
                name: cat.extended_info.name,
                items_sold: cat.items_sold,
            }));
            setChartData(defaultChartData);
        }
    }, [filterMode, selectedCategories, dateRange, categories]);

    const fetchMainCategories = async () => {
        setIsLoading(true);
        try {
            const data = await getCategoriesReport(dateRange.after, dateRange.before);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSingleCategoryData = async (categoryId: number) => {
        setIsLoading(true);
        try {
            const [products, stats] = await Promise.all([
                getCategoryProducts(categoryId, dateRange.after, dateRange.before),
                getCategoryStats(categoryId, dateRange.after, dateRange.before)
            ]);
            
            setCategoryProducts(products);
            setSingleCategoryStats(stats);
            
            // Format chart data from stats intervals
            if (stats && stats.intervals) {
                const formattedChartData = stats.intervals.map((interval: any) => ({
                    name: new Date(interval.date_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    items_sold: interval.subtotals.items_sold
                }));
                setChartData(formattedChartData);
            }
        } catch (error) {
            console.error("Error fetching single category data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (after: string, before: string) => {
        setDateRange({ after, before });
    };

    const handleFilterChange = (mode: string, selection?: CategoryReport[]) => {
        setFilterMode(mode);
        if (selection) {
            setSelectedCategories(selection);
        } else {
             setSelectedCategories([]);
        }
    };

    // Calculate stats for display
    const getStats = () => {
        if (filterMode === "single" && singleCategoryStats?.totals) {
             return {
                categoriesCount: 1, // Or maybe products count?
                itemsSold: singleCategoryStats.totals.items_sold,
                netSales: singleCategoryStats.totals.net_revenue,
                ordersCount: singleCategoryStats.totals.orders_count
             };
        }

        // Default stats logic for 'all' mode
        // For comparison mode, we would sum up selected categories
        let targetCategories = categories;
        if (filterMode === "comparison" && selectedCategories.length > 0) {
            targetCategories = selectedCategories;
        }

        const itemsSold = targetCategories.reduce((sum, cat) => sum + cat.items_sold, 0);
        const netSales = targetCategories.reduce((sum, cat) => sum + cat.net_revenue, 0);
        const ordersCount = targetCategories.reduce((sum, cat) => sum + cat.orders_count, 0);
        
        return { 
            categoriesCount: targetCategories.length, 
            itemsSold, 
            netSales, 
            ordersCount 
        };
    };

    const stats = getStats();

    // Conditional rendering for the table
    const renderTable = () => {
        if (filterMode === "single" && selectedCategories.length === 1) {
            return <ReportProductsTable products={categoryProducts} />;
        }
        
        // Default category table (filtered if comparison mode)
        let tableCategories = categories;
        if (filterMode === "comparison" && selectedCategories.length > 0) {
            tableCategories = selectedCategories;
        }
        return <CategoriesTable categories={tableCategories} />;
    };

    if (isLoading && categories.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Categories</h1>
                
                <Skeleton className="h-16 w-full mb-6" />
                
                <div className="bg-white border rounded-lg p-6 mb-6">
                    <Skeleton className="h-6 w-full" />
                </div>

                <div className="bg-white border rounded-lg p-6 mb-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>

                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-9 w-32" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Categories</h1>
            
            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-2">Date range:</label>
                    <DateRangePicker onDateChange={handleDateChange} isLoading={isLoading} />
                </div>
                <div className="flex-1">
                    <CategoryFilter 
                        categories={categories}
                        onFilterChange={handleFilterChange} 
                    />
                </div>
            </div>
            
            <CategoriesStats
                categoriesCount={stats.categoriesCount}
                itemsSold={stats.itemsSold}
                netSales={stats.netSales}
                ordersCount={stats.ordersCount}
            />
            
            <CategoriesChart data={chartData} />
            
            {renderTable()}
        </div>
    );
}
