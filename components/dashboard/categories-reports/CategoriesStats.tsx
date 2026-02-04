interface CategoriesStatsProps {
    categoriesCount: number;
    itemsSold: number;
    netSales: number;
    ordersCount: number;
}

export function CategoriesStats({ categoriesCount, itemsSold, netSales, ordersCount }: CategoriesStatsProps) {
    return (
        <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="text-center text-sm text-gray-600 space-x-4">
                <span><strong>{categoriesCount}</strong> Categories</span>
                <span><strong>{itemsSold}</strong> Item sold</span>
                <span><strong>₦{netSales.toFixed(2)}</strong> Net sales</span>
                <span><strong>{ordersCount}</strong> Order</span>
            </div>
        </div>
    );
}
