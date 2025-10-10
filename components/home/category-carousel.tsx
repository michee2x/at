"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import CardOne from "../cards/cardOne";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "../skeletons/product-card";

const CategoryCarousel = () => {
  const { products, loading, error } = useProducts({
    category: 17,
  });
  if (error) return <p>Error: {error}</p>;
  return (
    <section className="w-full lg:gap-[64px] flex flex-col items-center">
      <div className="carousel w-full gap-[24px]">
        {loading ? (
          <ProductCard />
        ) : (
          products.map((data) => {
            return <CardOne fillViewport={false} key={data.id} data={data} />;
          })
        )}
      </div>

      <button className="w-fit h-fit">
        <Link
          href="/"
          className="lg:w-[288px] w-[230px] h-[56px] rounded-[8px] border-[1px] border-[#C4C4C4] flex items-center justify-center px-[24px] py-[16px]"
        >
          <span className="text-[15px] text-nowrap flex gap-[12px] items-center text-[#222222] leading-[100%] tracking-[-0.7%] font-poppins">
            See All Categories{" "}
            <BsArrowUpRight className="transform rotate-45 text-3xl" />
          </span>
        </Link>
      </button>
    </section>
  );
};

export default CategoryCarousel;
