"use client";

import Image from "next/image";
import { useState } from "react";
import { GoStar } from "react-icons/go";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import { categories, Category } from "@/constants";
import { useFilter } from "@/contexts/filter-context";


interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
}

const products: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: "Kitchen Chimney",
  price: 39700,
  oldPrice: 51700,
  rating: 5,
  image: "/category-grid/cat-one/4e0477aa4f5dd4a25a45c18cd98b6c1952c42986.png", // replace with actual image
}));

export default function CategoryPage() {
  const [selectedFilters, setSelectedFilters] = useState({});
  const {showFilter, setShowFilter} = useFilter()
  

  return (
    <div className="min-h-screen font-poppins w-full bg-white">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 px-6 py-4">
        <Link href="/" className="text-purple-600 hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <span
          onClick={() => setShowFilter(true)}
          className="text-gray-800 font-medium"
        >
          Electronics
        </span>
      </nav>

      <div className="lg:px-6 xl:px-10 pb-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Electronics
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Sidebar Filter */}
          <aside
            className={`fixed ${
              showFilter ? "block" : "hidden"
            } overflow-y-scroll w-full z-50 bg-white top-0 lg:col-span-1 xl:w-[194px] lg:p-4 h-fit space-y-6`}
          >
            <div className="w-full border-b-[1.2px] border-gray-400 flex p-4 justify-between items-center">
              <span>Filters</span>
              <IoAddOutline
                onClick={() => setShowFilter(false)}
                className="text-2xl text-black transform rotate-45"
              />
            </div>
            <FilterSection
              title="Delivery Day"
              options={["Get it within 2 Days"]}
            />
            <FilterSection
              title="Brands"
              options={["Samsung", "Haier", "Miele", "LG", "Panasonic"]}
            />
            <FilterSection
              title="Price"
              options={[
                "Under ₦50000",
                "₦50000–₦100000",
                "₦100000–₦200000",
                "Above ₦200000",
              ]}
            />
            <FilterSection
              title="Deals & Discount"
              options={["Today's Deals", "Discounted Items"]}
            />
            <FilterSection
              title="Item Condition"
              options={["New", "Used", "Refurbished"]}
            />
            <FilterSection
              title="Pay on Delivery"
              options={["Eligible for Pay on Delivery"]}
            />
            <FilterSection
              title="Seller"
              options={["Mega Electronics", "Other Sellers"]}
            />
            <FilterSection
              title="Availability"
              options={["In Stock", "Out of Stock"]}
            />
          </aside>

          {/* Products Grid */}
          <section className="lg:col-span-5">
            <div
              className="
                grid lg:gap-x-4 gap-y-6
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                xl:grid-cols-4
              "
            >
              {categories.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  options,
}: {
  title: string;
  options: string[];
}) {
  return (
    <div>
      <h3 className="font-semibold pl-4 lg:pl-0 font-poppins text-gray-800 mb-2">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {options.map((opt) => (
          <li key={opt} className="flex pl-4 items-center space-x-2">
            <input
              type="checkbox"
              id={opt}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor={opt}>{opt}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({product}:{product:Category}) {
  return (
    <div className="border border-[#E9E9E9] font-poppins rounded-xl p-3 flex flex-col">
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h2 className="text-[15px] flex items-center justify-between font-poppins font-medium text-black mb-1">
        {product.name}
        <div className="flex items-center text-yellow-500">
          {Array.from({ length: 4}).map((_, i) => (
            <GoStar key={i} />
          ))}
        </div>
      </h2>
      <p className="text-xs font-poppins text-gray-500 mb-1">
        Elica 60 cm 1200 m3/hr Filterless Autoclean Kitchen Chimney with 15
        Years Warranty (WDFL 606 HAC LT...)
      </p>

      <div className="flex items-center justify-between mt-6">
        <div>
          <span className="flex items-center gap-2">
            <div className="w-[13.5px] relative h-[13.5px] lg:w-[16px] lg:h-[16px]">
              <Image
                src="/home/hero/Nigeria.png"
                className="object-cover"
                alt="nigeria logo"
                fill
              />
            </div>
            <span className="text-[15px] lg:text-[14px] text-[#6A00EF]">
              98,700
            </span>
          </span>
          <p className="text-[10px] text-black/50">300+ purchased</p>
        </div>
        <button className="mt-auto w-[110px] flex items-center justify-center gap-[8px] h-[36px] px-[14px] bg-[#6A00EF] text-white py-[10px] rounded-[24px] hover:bg-purple-700 transition">
          <IoAddOutline className="text-xl text-white" />
          <span className="text-[10px] text-nowrap text-white">
            Add to Cart
          </span>
        </button>
      </div>
    </div>
  );
}
