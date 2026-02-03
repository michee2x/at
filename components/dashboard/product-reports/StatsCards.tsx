interface StatsCardsProps {
    itemsSold: number;
    netRevenue: number;
    ordersCount: number;
}

export function StatsCards({ itemsSold, netRevenue, ordersCount }: StatsCardsProps) {
    const stats = [
        { label: "Items sold", value: itemsSold, percentage: "0%" },
        { label: "Net sales", value: `₦${(netRevenue || 0).toFixed(2)}`, percentage: "0%" },
        { label: "Orders", value: ordersCount, percentage: "0%" },
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
