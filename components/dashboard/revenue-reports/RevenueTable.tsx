"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";

interface RevenueInterval {
    interval: string;
    orders_count: number;
    gross_sales: number;
    refunds: number;
    coupons: number;
    net_revenue: number;
    taxes: number;
    shipping: number;
    total_sales: number;
}

interface RevenueTableProps {
    intervals: RevenueInterval[];
    vendorId?: number;
}

export function RevenueTable({ intervals, vendorId = 29 }: RevenueTableProps) {
    const [columns, setColumns] = useState([
        { key: "date", label: "Date", visible: true },
        { key: "orders", label: "Orders", visible: true },
        { key: "gross_sales", label: "Gross sales", visible: true },
        { key: "returns", label: "Returns", visible: true },
        { key: "coupons", label: "Coupons", visible: true },
        { key: "net_sales", label: "Net sales", visible: true },
        { key: "taxes", label: "Taxes", visible: true },
        { key: "shipping", label: "Shipping", visible: true },
        { key: "total_sales", label: "Total sales", visible: true },
    ]);

    const tableData = intervals.map((interval) => ({
        date: interval.interval,
        orders: interval.orders_count,
        gross_sales: `₦${interval.gross_sales.toFixed(2)}`,
        returns: `₦${interval.refunds.toFixed(2)}`,
        coupons: `₦${interval.coupons.toFixed(2)}`,
        net_sales: `₦${interval.net_revenue.toFixed(2)}`,
        taxes: `₦${interval.taxes.toFixed(2)}`,
        shipping: `₦${interval.shipping.toFixed(2)}`,
        total_sales: `₦${interval.total_sales.toFixed(2)}`,
    }));

    const handleColumnToggle = (key: string) => {
        setColumns(cols => cols.map(col => 
            col.key === key ? { ...col, visible: !col.visible } : col
        ));
    };

    const handleDownload = () => {
        const today = new Date().toISOString().split('T')[0];
        const filename = `revenue_${today}_path--analytics-revenue_seller-id-${vendorId}.csv`;
        
        const headers = columns.filter(c => c.visible).map(c => `"${c.label}"`).join(',');
        const rows = intervals.map(interval => {
            const row = [];
            if (columns.find(c => c.key === 'date' && c.visible)) row.push(`"${interval.interval} 00:00:00"`);
            if (columns.find(c => c.key === 'orders' && c.visible)) row.push(interval.orders_count);
            if (columns.find(c => c.key === 'gross_sales' && c.visible)) row.push(interval.gross_sales);
            if (columns.find(c => c.key === 'returns' && c.visible)) row.push(interval.refunds);
            if (columns.find(c => c.key === 'coupons' && c.visible)) row.push(interval.coupons);
            if (columns.find(c => c.key === 'net_sales' && c.visible)) row.push(interval.net_revenue);
            if (columns.find(c => c.key === 'taxes' && c.visible)) row.push(interval.taxes);
            if (columns.find(c => c.key === 'shipping' && c.visible)) row.push(interval.shipping);
            if (columns.find(c => c.key === 'total_sales' && c.visible)) row.push(interval.total_sales);
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

    return (
        <DataTable
            title="Revenue"
            columns={columns}
            data={tableData}
            onDownload={handleDownload}
            onColumnToggle={handleColumnToggle}
        />
    );
}
