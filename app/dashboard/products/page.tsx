"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
    Plus, Package, MoreHorizontal, Search, PackageX, 
    Filter, RefreshCw, Trash2, Edit, CheckSquare, Square,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  slug: string;
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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination (Simple client-side for now or passed to API)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
            page: page.toString(),
            per_page: "20",
        });
        
        if (search) query.append("search", search);
        if (statusFilter && statusFilter !== "all") query.append("status", statusFilter);

        const res = await fetch(`/api/vendor/products?${query.toString()}`);
        if (res.ok) {
           const data = await res.json();
           setProducts(data);
           // If API returns meta, setTotalPages(data.meta.totalPages)
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const toggleSelectAll = () => {
      if (selectedIds.length === products.length) {
          setSelectedIds([]);
      } else {
          setSelectedIds(products.map(p => p.id));
      }
  };

  const toggleSelect = (id: number) => {
      if (selectedIds.includes(id)) {
          setSelectedIds(selectedIds.filter(i => i !== id));
      } else {
          setSelectedIds([...selectedIds, id]);
      }
  };

  const handleBulkDelete = async () => {
      if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
      
      const toastId = toast.loading("Deleting products...");
      
      try {
          // Promise.all for parallel deletion (or create a bulk API)
          await Promise.all(selectedIds.map(id => 
              fetch(`/api/vendor/products/${id}`, { method: 'DELETE' })
          ));
          
          toast.update(toastId, { render: "Products deleted", type: "success", isLoading: false, autoClose: 3000 });
          setSelectedIds([]);
          fetchProducts();
      } catch (e) {
          toast.update(toastId, { render: "Failed to delete some products", type: "error", isLoading: false, autoClose: 3000 });
      }
  };

  const handleDeleteSingle = async (id: number) => {
      if (!confirm("Delete this product?")) return;
      try {
          const res = await fetch(`/api/vendor/products/${id}`, { method: 'DELETE' });
          if (res.ok) {
              toast.success("Product deleted");
              fetchProducts();
          } else {
              toast.error("Failed to delete");
          }
      } catch (e) {
          toast.error("Error deleting product");
      }
  };

  if (isLoading && products.length === 0) {
    return <ProductsLoading />;
  }

  // EMPTY STATE (Only if no search/filter active)
  if (products.length === 0 && !search && statusFilter === "all") {
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory
          </p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/products/add">
            <Button className="bg-[#6a00f3] hover:bg-[#5b00d1] rounded-xl h-11">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
            </Button>
            </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            {/* Search */}
            <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search products..." 
                    className="pl-9 bg-white" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
                 {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="publish">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                </Select>

                {/* Bulk Actions (Conditional) */}
                {selectedIds.length > 0 && (
                     <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="animate-in fade-in zoom-in">
                         <Trash2 className="mr-2 h-4 w-4" />
                         Delete ({selectedIds.length})
                     </Button>
                )}
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="py-3 px-4 w-10">
                    <Checkbox 
                        checked={products.length > 0 && selectedIds.length === products.length}
                        onCheckedChange={toggleSelectAll}
                    />
                </th>
                <th className="py-3 px-4 w-20">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length === 0 ? (
                  <tr>
                      <td colSpan={7} className="h-64 text-center text-muted-foreground">
                          No products match your search.
                      </td>
                  </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-purple-50/30 transition-colors group">
                  <td className="p-4">
                     <Checkbox 
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                     />
                  </td>
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
                     <Link href={`/dashboard/products/edit/${product.slug}`} className="block">
                        <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors cursor-pointer line-clamp-2 max-w-xs">{product.name}</div>
                        <div className="text-xs text-gray-500">ID: {product.id}</div>
                     </Link>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="p-4">
                     {product.stock_status === 'instock' ? (
                         <span className="text-green-600 font-medium text-xs flex items-center gap-1">
                             <div className="h-2 w-2 rounded-full bg-green-500"></div>
                             {(product.stock_quantity ?? 'In Stock')}
                         </span>
                     ) : (
                         <span className="text-red-500 font-medium text-xs flex items-center gap-1">
                             <div className="h-2 w-2 rounded-full bg-red-500"></div>
                             Out of Stock
                         </span>
                     )}
                  </td>
                  <td className="p-4 font-medium">
                     {/* Naive formatting, assumes NGN */}
                     ₦{parseInt(product.price || "0").toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/products/edit/${product.slug}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                         {/* <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteSingle(product.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer (Simple) */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
                Page {page}
            </span>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={products.length < 20 || isLoading} // Primitive check
                >
                    Next <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        publish: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
        draft: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
        pending: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200",
        private: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200",
    };
    return (
        <Badge variant="secondary" className={`capitalize font-normal border ${styles[status] || styles.draft}`}>
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
