"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/dashboard/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const slug = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Fetch by slug using list API with filter
        const res = await fetch(`/api/vendor/products?slug=${slug}`);
        if (!res.ok) {
           throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        
        // Data is array of products matching slug (should be 1)
        if (data && data.length > 0) {
            setProduct(data[0]);
        } else {
             // If not found by slug, maybe it IS an ID? (Fallback)
             const resId = await fetch(`/api/vendor/products/${slug}`);
             if (resId.ok) {
                 const dataId = await resId.json();
                 setProduct(dataId);
             } else {
                 setProduct(null);
             }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
        fetchProduct();
    }
  }, [slug, router]);

  if (loading) { // Centered loader
    return (
        <div className="h-[calc(100vh-100px)] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
    );
  }

  if (!product) {
      return <div>Product not found</div>;
  }

  return <ProductForm initialData={product} isEditing={true} />;
}
