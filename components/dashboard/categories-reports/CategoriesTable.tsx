"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryReport } from "@/lib/actions/dashboard/categories-reports";

interface CategoriesTableProps {
    categories: CategoryReport[];
    vendorId?: number;
}

export function CategoriesTable({ categories, vendorId = 29 }: CategoriesTableProps) {
    const handleDownload = () => {
        const today = new Date().toISOString().split('T')[0];
        const filename = `categories_${today}_path--analytics-categories_seller-id-${vendorId}.csv`;
        
        const headers = '"Category","Items Sold","Net Sales","Orders"';
        const rows = categories.map(cat => {
            return [
                `"${cat.extended_info.name}"`,
                cat.items_sold,
                cat.net_revenue.toFixed(2),
                cat.orders_count,
            ].join(',');
        });

        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Categories</h3>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                            <th className="pb-3 px-4">Category</th>
                            <th className="pb-3 px-4 text-right">Items Sold</th>
                            <th className="pb-3 px-4 text-right">Net Sales</th>
                            <th className="pb-3 px-4 text-right">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                    No categories found
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.category_id} className="border-b last:border-0">
                                    <td className="py-3 px-4">{cat.extended_info.name}</td>
                                    <td className="py-3 px-4 text-right">{cat.items_sold}</td>
                                    <td className="py-3 px-4 text-right">₦{cat.net_revenue.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">{cat.orders_count}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
