"use client";

import CategoryFilters from "@/components/CategoryFilters";
import { useFilter } from "@/contexts/filter-context";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

export interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews?: number;
  seller: string;
  delivery: string;
}

interface Props {
  product: Product;
}
interface SearchPageProps {
  searchParams: { q?: string };
}

type FilterMap = Record<string, string>;

const ProductCard = ({ product }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-4 mb-4">
      {/* Image */}
      <div className="w-full sm:w-1/4 flex items-center justify-center mb-3 sm:mb-0">
        <img
          src={product.image}
          alt={product.title}
          className="h-40 object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1 px-2">
        <h2 className="text-lg font-medium text-blue-900 hover:text-blue-600 cursor-pointer">
          {product.title}
        </h2>
        <div className="flex items-center text-yellow-500 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={
                i < product.rating ? "fill-yellow-400" : "fill-gray-300"
              }
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {product.reviews || 0} Ratings
          </span>
        </div>

        <div className="mt-2 text-2xl font-semibold">₹{product.price}</div>
        {product.oldPrice && (
          <div className="text-gray-500 text-sm line-through">
            ₹{product.oldPrice}
          </div>
        )}
        <p className="text-gray-600 mt-2 text-sm">{product.delivery}</p>
        <p className="text-gray-600 text-sm">
          FREE Delivery by {product.seller}
        </p>
      </div>
    </div>
  );
};

export default function Page({ searchParams }: SearchPageProps) {
  const { setShowFilter } = useFilter();
  const [filters, setFilters] = useState<FilterMap>({});
  const products: Product[] = [
    {
      id: 1,
      title:
        "Samsung Galaxy Z Fold3 5G (Phantom Black, 12GB RAM, 256GB Storage)",
      image: "https://m.media-amazon.com/images/I/71sxlhYhKWL._AC_UL320_.jpg",
      price: "120000",
      rating: 4,
      seller: "Amazon.in",
      delivery: "FREE Delivery by Amazon",
    },
    {
      id: 2,
      title: "Apple iPhone 12 Pro Max (128 GB) - Pacific Blue",
      image: "https://m.media-amazon.com/images/I/71fVoqRC0wL._AC_UL320_.jpg",
      price: "115500",
      rating: 5,
      seller: "Amazon.in",
      delivery: "FREE Delivery by Amazon",
    },
    {
      id: 3,
      title: "Apple iPhone 12 Pro (128 GB) - Gold",
      image: "https://m.media-amazon.com/images/I/71xkMA+gvYL._AC_UL320_.jpg",
      price: "139900",
      rating: 5,
      seller: "Amazon.in",
      delivery: "FREE Delivery by Amazon",
    },
    {
      id: 4,
      title: "Samsung Galaxy Z Flip3 5G (Cream, 8GB RAM, 128GB Storage)",
      image: "https://m.media-amazon.com/images/I/71fVoqRC0wL._AC_UL320_.jpg",
      price: "84999",
      rating: 4,
      seller: "Cart Count",
      delivery: "FREE Delivery by Cart Count",
    },
    {
      id: 5,
      title: "Redmi 9A (Nature Green, 32GB ROM, 2GB RAM)",
      image: "https://m.media-amazon.com/images/I/71sxlhYhKWL._AC_UL320_.jpg",
      price: "7999",
      rating: 3,
      seller: "AliBazaar",
      delivery: "FREE Delivery by AliBazaar",
    },
  ];
  const query = searchParams.q || "All Products";

  return (
    <main className="flex flex-col md:flex-row max-w-7xl mx-auto py-6">
      <CategoryFilters filters={filters} setFilters={setFilters} />
      <section className="flex-1 px-4">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <p className="text-sm text-gray-600">
            1–5 of over 2,000 results for "iphone"
          </p>
          <HiAdjustmentsHorizontal
            onClick={() => setShowFilter(true)}
            className="text-2xl lg:hidden text-gray-700"
          />
        </div>

        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </main>
  );
}
