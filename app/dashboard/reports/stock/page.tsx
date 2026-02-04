"use client";

import { useState, useEffect } from "react";
import { getStockStats, getStockProducts, StockProduct } from "@/lib/actions/dashboard/stock-reports";
import { StockStats } from "@/components/dashboard/stock-reports/StockStats";
import { StockTable } from "@/components/dashboard/stock-reports/StockTable";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function StockReportsPage() {
    const [stats, setStats] = useState({
        lowstock: 0,
        instock: 0,
        outofstock: 0,
        onbackorder: 0,
        products: 0,
    });
    const [products, setProducts] = useState<StockProduct[]>([]);
    const [filterType, setFilterType] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStockData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filterType]);

    const fetchStockData = async () => {
        setIsLoading(true);
        try {
            const statsData = await getStockStats();
            setStats(statsData.totals);
            const productsData = await getStockProducts("all", 1, 25);
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const productsData = await getStockProducts(filterType, 1, 25);
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Stock</h1>
                
                <div className="bg-white border rounded-lg p-6 mb-6">
                    <Skeleton className="h-6 w-full" />
                </div>

                <div className="mb-4">
                    <Skeleton className="h-10 w-48" />
                </div>

                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-9 w-36" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Stock</h1>
            
            <StockStats
                products={stats.products}
                outOfStock={stats.outofstock}
                lowStock={stats.lowstock}
                onBackorder={stats.onbackorder}
                inStock={stats.instock}
            />

            <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Show:</label>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All products" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All products</SelectItem>
                        <SelectItem value="outofstock">Out of stock</SelectItem>
                        <SelectItem value="lowstock">Low stock</SelectItem>
                        <SelectItem value="instock">In stock</SelectItem>
                        <SelectItem value="onbackorder">On backorder</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <StockTable products={products} />
        </div>
    );
}
