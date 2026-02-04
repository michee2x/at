"use client";

import { useState } from "react";
import { Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { StockProduct } from "@/lib/actions/dashboard/stock-reports";

interface StockTableProps {
    products: StockProduct[];
    vendorId?: number;
}

export function StockTable({ products, vendorId = 29 }: StockTableProps) {
    const [columns, setColumns] = useState([
        { key: "name", label: "Product / Variation", visible: true },
        { key: "sku", label: "SKU", visible: true },
        { key: "status", label: "Status", visible: true },
        { key: "stock", label: "Stock", visible: true },
    ]);

    const handleColumnToggle = (key: string) => {
        setColumns(cols => cols.map(col => 
            col.key === key ? { ...col, visible: !col.visible } : col
        ));
    };

    const handleDownload = () => {
        const today = new Date().toISOString().split('T')[0];
        const filename = `stock_${today}_path--analytics-stock_seller-id-${vendorId}.csv`;
        
        const headers = columns.filter(c => c.visible).map(c => `"${c.label}"`).join(',');
        const rows = products.map(product => {
            const row = [];
            if (columns.find(c => c.key === 'name' && c.visible)) row.push(`"${product.name}"`);
            if (columns.find(c => c.key === 'sku' && c.visible)) row.push(`"${product.sku || '-'}"`);
            if (columns.find(c => c.key === 'status' && c.visible)) row.push(`"${product.stock_status}"`);
            if (columns.find(c => c.key === 'stock' && c.visible)) row.push(product.stock_quantity || 'N/A');
            return row.join(',');
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

    const visibleColumns = columns.filter(col => col.visible);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            instock: { label: "In stock", className: "bg-purple-100 text-purple-700" },
            outofstock: { label: "Out of stock", className: "bg-red-100 text-red-700" },
            onbackorder: { label: "On backorder", className: "bg-yellow-100 text-yellow-700" },
            lowstock: { label: "Low stock", className: "bg-orange-100 text-orange-700" },
        };
        
        const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" };
        
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.className}`}>
                {statusInfo.label}
            </span>
        );
    };

    return (
        <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Stock</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <div className="p-2">
                                <div className="text-sm font-medium mb-2">Columns:</div>
                                {columns.map((col) => (
                                    <div key={col.key} className="flex items-center justify-between py-2">
                                        <span className="text-sm">{col.label}</span>
                                        <Switch
                                            checked={col.visible}
                                            onCheckedChange={() => handleColumnToggle(col.key)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                            {visibleColumns.map((col) => (
                                <th key={col.key} className="pb-3 px-4">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={visibleColumns.length} className="py-8 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="border-b last:border-0">
                                    {visibleColumns.map((col) => (
                                        <td key={col.key} className="py-3 px-4">
                                            {col.key === 'name' && product.name}
                                            {col.key === 'sku' && (product.sku || '-')}
                                            {col.key === 'status' && getStatusBadge(product.stock_status)}
                                            {col.key === 'stock' && (product.stock_quantity || 'N/A')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
