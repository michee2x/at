import { WooCategory } from "@/types";
import Image from "next/image";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";

const CategoryCard = ({category, img}:{category?:WooCategory, img:string}) => {
    console.log(category)
  return (
    <div className="lg:w-[244px] w-full carousel-item flex flex-col h-[220px] lg:h-[285px]">
      <div className="w-full rounded-[12px] relative bg-[#FAFAFA] h-[244px]">
        <Image
          fill
          src={img}
          alt="sub-category image"
          className="object-cover object-center"
        />
      </div>
      <div className="flex-1 flex pt-1.5 flex-col gap-1 justify-between">
        <div className="flex w-full justify-between items-center">
          <span className="lg:text-[16px] text-[12px] text-nowrap flex gap-2 lg:gap-[12px] items-center text-[#2B2B2B] leading-[100%] tracking-[0%] font-display">
            KIDDIES OUTERWEAR
            <GoArrowUpRight className="text-xl lg:text-2xl" />
          </span>
          <span className="w-full h-full flex items-end text-[#6C757D] lg:text-[12px] leading-[100%] tracking-[0%] justify-end text-[8px] font-display">
            NIKE
          </span>
        </div>

        <span className="text-[12px] text-black/50 font-poppins">
          Made to cater for the finest african hair to nurture your roots and
          scalps. Best for all hair types...
        </span>
        <span className="flex items-center gap-2">
          <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
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
      </div>
    </div>
  );
};

export default CategoryCard;
