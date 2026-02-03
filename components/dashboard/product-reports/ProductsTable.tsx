interface Product {
    id: number;
    title: string;
    sku: string;
    items_sold: number;
    net_sales: string;
}

interface ProductsTableProps {
    products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
    const totalProducts = products.length;
    const totalItemsSold = products.reduce((sum, p) => sum + p.items_sold, 0);
    const totalNetSales = products.reduce((sum, p) => sum + parseFloat(p.net_sales), 0);

    return (
        <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <table className="w-full">
                <thead>
                    <tr className="border-b text-left text-sm text-gray-600">
                        <th className="pb-3">Product title</th>
                        <th className="pb-3">SKU</th>
                        <th className="pb-3 text-right">Items sold</th>
                        <th className="pb-3 text-right">Net sales</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-b last:border-0">
                            <td className="py-3">{product.title}</td>
                            <td className="py-3 text-gray-600">{product.sku}</td>
                            <td className="py-3 text-right">{product.items_sold}</td>
                            <td className="py-3 text-right">₦{parseFloat(product.net_sales).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                {totalProducts} Product · {totalItemsSold} Item sold · ₦{totalNetSales.toFixed(2)} Net sales · {totalItemsSold} Order
            </div>
        </div>
    );
}
