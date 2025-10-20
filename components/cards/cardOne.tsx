import { WooProduct } from "@/types";
import Image from "next/image";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";

const CardOne = ({
  data,
  fillViewport = true,
  newproduct = false,
}: {
  data: WooProduct;
  fillViewport?: boolean;
  newproduct?: boolean;
}) => {
  return (
    <div
      className={`carousel-item lg:w-[230px] ${
        fillViewport ? "w-full" : "w-[240px]"
      } h-[300px] lg:h-fit gap-[4px] flex flex-col`}
    >
      <div className="relative overflow-hidden p-1.5 lg:p-2 h-[200px] w-full lg:w-[230px] rounded-xl bg-[#FAFAFA]">
        {data?.images[0]?.src && (
          <Image
            fill
            src={data?.images[0]?.src}
            alt={data?.name}
            className="object-contain object-center"
            sizes={data?.images[0]?.sizes}
          />
        )}
        {newproduct && (
          <span className="absolute z-50 top-1 left-1 lg:w-[3.3rem] w-[3rem] text-[10px] lg:text-[12.32px] h-4 lg:h-6 text-white bg-[#185245] rounded-tr-lg rounded-tl-[2px] rounded-br-[2px] rounded-bl-lg flex items-center justify-center">
            new
          </span>
        )}
      </div>

      <div className="w-full flex-col font-poppins flex justify-between text-[#6C757D] text-[12px]">
        <span className="lg:text-[16px] text-[12px] text-nowrap flex gap-2 lg:gap-[12px] items-center text-[#2B2B2B] leading-[100%] tracking-[0%] font-display">
          {data?.name?.replace("amp;", "")}
          <GoArrowUpRight className="text-xl lg:text-2xl" />
        </span>
        <div className="flex underline text-[12px] text-[#6C757D] font-display items-center gap-[1px]">
          {data?.categories[0]?.name?.replace("amp;", "")}
        </div>
      </div>
      <span className="text-[12px] text-black/50 font-poppins">
        Made to cater for the finest african hair to nurture your roots and
        scalps. Best for all hair types...
      </span>
      <div className="flex items-center gap-2">
        <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
          <Image
            src="/home/hero/Nigeria.png"
            className="object-cover"
            alt="nigeria logo"
            fill
          />
        </div>
        <span className="text-[15px] lg:text-[14px] text-[#6A00EF]">
          {data?.price}
        </span>
      </div>
    </div>
  );
};

export default CardOne;
