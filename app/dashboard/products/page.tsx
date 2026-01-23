"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, MoreHorizontal, Search, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  status: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  stock_quantity: number | null;
  images: { src: string; alt: string }[];
  date_created: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/vendor/products");
        if (res.ok) {
           const data = await res.json();
           setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return <ProductsLoading />;
  }

  // EMPTY STATE
  if (products.length === 0) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-48 h-48 bg-purple-50 rounded-full flex items-center justify-center mb-6">
           <PackageX className="h-20 w-20 text-purple-200" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found!</h2>
        <p className="text-muted-foreground mb-8 max-w-sm text-center">
          Ready to start selling something awesome? Add your first product to get started.
        </p>
        <div className="flex gap-4">
             <Link href="/dashboard/products/add">
                <Button className="bg-[#6a00f3] hover:bg-[#5b00d1] h-12 px-8 rounded-xl font-medium">
                  <Plus className="mr-2 h-5 w-5" />
                  Add new product
                </Button>
            </Link>
            <Button variant="outline" className="h-12 px-8 rounded-xl font-medium">
                Import
            </Button>
        </div>
      </div>
    );
  }

  // PRODUCT LIST
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory ({products.length})
          </p>
        </div>
        <Link href="/dashboard/products/add">
          <Button className="bg-[#6a00f3] hover:bg-[#5b00d1] rounded-xl h-11">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products..." className="pl-9 rounded-lg" />
            </div>
            {/* Filters placeholder */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="py-3 px-4 w-20">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="relative h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2 max-w-xs">{product.name}</div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="p-4">
                     {product.stock_status === 'instock' ? (
                         <span className="text-green-600 font-medium text-xs">{(product.stock_quantity ?? 'In Stock')}</span>
                     ) : (
                         <span className="text-red-500 font-medium text-xs">Out of Stock</span>
                     )}
                  </td>
                  <td className="p-4 font-medium">
                     {/* Naive formatting, assumes NGN */}
                     ₦{parseInt(product.price || "0").toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                       <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        publish: "bg-green-100 text-green-700 hover:bg-green-100",
        draft: "bg-gray-100 text-gray-700 hover:bg-gray-100",
        pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
        private: "bg-red-100 text-red-700 hover:bg-red-100",
    };
    return (
        <Badge variant="secondary" className={`capitalize font-normal ${styles[status] || styles.draft}`}>
            {status}
        </Badge>
    );
}

function ProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
         </div>
         <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-xl border bg-white p-4 space-y-4">
         <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-64" />
         </div>
         {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex gap-4 items-center">
                 <Skeleton className="h-12 w-12 rounded-lg" />
                 <div className="space-y-2 flex-1">
                     <Skeleton className="h-4 w-1/3" />
                     <Skeleton className="h-3 w-1/4" />
                 </div>
                 <Skeleton className="h-8 w-20" />
             </div>
         ))}
      </div>
    </div>
  );
}

