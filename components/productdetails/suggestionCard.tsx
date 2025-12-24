import { WooProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";


export default function ProductSuggestionList({
  suggestions,
}: {
  suggestions: WooProduct[];
}) {
  return (
    <ul className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mt-6">
      {suggestions.map((item) => (
        <li
          key={item.id}
          className="group relative flex flex-col w-full"
          itemScope
          itemType="http://schema.org/Product"
        >
          <Link
            href={`/product/${item.slug}`}
            className="block relative w-full aspect-square bg-[#FAFAFA] rounded-xl overflow-hidden hover:opacity-95 transition-opacity"
            itemProp="url"
          >
            <Image
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              src={item.images?.[0]?.src ?? "/placeholder.png"}
              alt={item.name ?? "Product image"}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </Link>

          <div className="mt-3 flex flex-col gap-1">
            <Link 
              href={`/product/${item.slug}`}
              className="font-medium text-gray-900 line-clamp-2 text-sm lg:text-base hover:text-[#6a00f3] transition-colors"
              itemProp="name"
            >
              {item.name}
            </Link>
            
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold text-gray-900">
                ₦{Number(item.price).toLocaleString()}
              </span>
              
              <button 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#6a00f3] hover:text-white transition-colors"
                aria-label="View Product"
              >
                <GoArrowUpRight className="text-lg" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
