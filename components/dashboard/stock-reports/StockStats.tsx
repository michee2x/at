interface StockStatsProps {
    products: number;
    outOfStock: number;
    lowStock: number;
    onBackorder: number;
    inStock: number;
}

export function StockStats({ products, outOfStock, lowStock, onBackorder, inStock }: StockStatsProps) {
    return (
        <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="text-center text-sm text-gray-600 space-x-4">
                <span><strong>{products}</strong> Product</span>
                <span><strong>{outOfStock}</strong> Out of stock</span>
                <span><strong>{lowStock}</strong> Low stock</span>
                <span><strong>{onBackorder}</strong> On backorder</span>
                <span><strong>{inStock}</strong> In stock</span>
            </div>
        </div>
    );
}
