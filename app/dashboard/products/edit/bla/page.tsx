"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/dashboard/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/vendor/products/${id}`);
        if (!res.ok) {
           throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        // router.push("/dashboard/products"); // Redirect on error?
      } finally {
        setLoading(false);
      }
    }

    if (id) {
        fetchProduct();
    }
  }, [id, router]);

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
