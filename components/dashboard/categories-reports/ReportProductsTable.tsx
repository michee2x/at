"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryProductReport } from "@/lib/actions/dashboard/categories-reports";

interface ReportProductsTableProps {
    products: CategoryProductReport[];
    vendorId?: number;
}

export function ReportProductsTable({ products, vendorId = 29 }: ReportProductsTableProps) {
    const handleDownload = () => {
        const today = new Date().toISOString().split('T')[0];
        const filename = `category_products_${today}_seller-id-${vendorId}.csv`;
        
        const headers = '"Product Title","SKU","Items Sold","Net Sales","Orders"';
        const rows = products.map(prod => {
            return [
                `"${prod.extended_info.name}"`,
                `"${prod.extended_info.sku || '-'}"`,
                prod.items_sold,
                prod.net_revenue.toFixed(2),
                prod.orders_count,
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
                <h3 className="text-lg font-semibold">Products</h3>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={products.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                            <th className="pb-3 px-4">Product Title</th>
                            <th className="pb-3 px-4">SKU</th>
                            <th className="pb-3 px-4 text-right">Items Sold</th>
                            <th className="pb-3 px-4 text-right">Net Sales</th>
                            <th className="pb-3 px-4 text-right">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    No products found in this category
                                </td>
                            </tr>
                        ) : (
                            products.map((prod) => (
                                <tr key={prod.product_id} className="border-b last:border-0">
                                    <td className="py-3 px-4 text-purple-600 font-medium">{prod.extended_info.name}</td>
                                    <td className="py-3 px-4">{prod.extended_info.sku || '-'}</td>
                                    <td className="py-3 px-4 text-right">{prod.items_sold}</td>
                                    <td className="py-3 px-4 text-right">₦{prod.net_revenue.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">{prod.orders_count}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
