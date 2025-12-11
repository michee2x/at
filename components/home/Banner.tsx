// components/category/Banner.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const bannerItems = [
  { label: "TODAY'S DEALS", param: "todays-deals", filter: "on_sale=true" },
  { label: "WEEKLY DEALS", param: "weekly-deals", filter: "on_sale=true" },
  {
    label: "BUNDLE DEALS",
    param: "bundle-deals",
    filter: "product_type=grouped",
  },
  { label: "TOP BRANDS", param: "top-brands", filter: "featured=true" },
  {
    label: "BEST SELLERS",
    param: "best-sellers",
    filter: "orderby=popularity",
  },
  { label: "NEW ARRIVALS", param: "new-arrivals", filter: "orderby=date" },
  {
    label: "COMING SOON",
    param: "coming-soon",
    filter: "catalog_visibility=hidden",
  },
];

export default function Banner() {
  const searchParams = useSearchParams();
  const activeBanner = searchParams.get("banner");

  return (
    <div className="bg-black hidden text-white lg:flex items-center justify-between px-4 py-2 overflow-x-auto">
      {bannerItems.map((item) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          key={item.param}
          href={`/categories?banner=${item.param}&${
            item.filter
          }&title=${encodeURIComponent(item.label)}`}
          className={`text-sm whitespace-nowrap px-4 py-1 transition-colors ${
            activeBanner === item.param
              ? "text-purple-400 font-semibold"
              : "hover:text-gray-300"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
