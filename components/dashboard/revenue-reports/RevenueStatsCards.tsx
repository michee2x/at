interface RevenueStatsCardsProps {
    grossSales: number;
    returns: number;
    coupons: number;
    netSales: number;
    taxes: number;
    shipping: number;
}

export function RevenueStatsCards({
    grossSales,
    returns,
    coupons,
    netSales,
    taxes,
    shipping,
}: RevenueStatsCardsProps) {
    const stats = [
        { label: "Gross sales", value: `₦${(grossSales || 0).toFixed(2)}`, percentage: "0%" },
        { label: "Returns", value: `₦${(returns || 0).toFixed(2)}`, percentage: "0%" },
        { label: "Coupons", value: `₦${(coupons || 0).toFixed(2)}`, percentage: "0%" },
        { label: "Net sales", value: `₦${(netSales || 0).toFixed(2)}`, percentage: "0%" },
        { label: "Taxes", value: `₦${(taxes || 0).toFixed(2)}`, percentage: "0%" },
        { label: "Shipping", value: `₦${(shipping || 0).toFixed(2)}`, percentage: "0%" },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.percentage}</div>
                </div>
            ))}
        </div>
    );
}
