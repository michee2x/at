import { WooCategory } from "@/types";
import Image from "next/image";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";

const CategoryCard = ({category}:{category?:WooCategory}) => {
    console.log(category)
  return (
    <div className="lg:w-[244px] w-full carousel-item flex flex-col h-[220px] lg:h-[285px]">
      <div className="w-full rounded-[12px] relative bg-[#FAFAFA] h-[244px]">
        <Image
          fill
          src={
            "/home/sub-category-images/8ce9ca94c3d92facb1276f4bac4d0752af06ae45.png"
          }
          alt="sub-category image"
          className="object-cover object-center"
        />
      </div>
      <div className="flex-1 flex pt-1.5 flex-col gap-1 justify-between">
        <span className="lg:text-[16px] text-[12px] text-nowrap flex gap-2 lg:gap-[12px] items-center text-[#2B2B2B] leading-[100%] tracking-[0%] font-display">
          KIDDIES OUTERWEAR
          <GoArrowUpRight className="text-xl lg:text-2xl" />
        </span>
        <span className="w-full h-full flex items-end text-[#6C757D] lg:text-[12px] leading-[100%] tracking-[0%] justify-end text-[8px] font-display">
          NIKE
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
