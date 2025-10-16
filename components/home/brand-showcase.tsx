"use client"
import { WooCategory } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { catImages } from "./sub-category-section";

const BrandShowCase = ({
  categories,
  banner,
  bannerText,
  reverseHorizontally,
  reverseVertically,
}: {
  categories: WooCategory[];
  banner: string;
  bannerText: string;
  reverseHorizontally?: boolean;
  reverseVertically?: boolean;
}) => {
  return (
    <div
      className={`lg:h-[772px] h-auto overflow-hidden gap-3 mt-28 w-full flex ${
        reverseVertically ? "flex-col-reverse" : "flex-col"
      } ${
        reverseHorizontally ? "lg:flex-row-reverse" : "lg:flex-row"
      } justify-between`}
    >
      <div className="w-full px-3 h-auto lg:flex-1 flex items-center justify-center">
        <div className="flex-1 grid grid-cols-2 gap-2.5 lg:gap-5 h-full lg:flex lg:flex-col lg:place-content-between">
          {[categories.slice(0, 3), categories.slice(3, 6)].map((arr, idx) => {
            return (
              <div
                key={`${idx}`}
                className="lg:flex hidden w-full lg:gap-5 items-center h-fit"
              >
                {arr.map((data, idx) => {
                  return (
                    <div
                      key={`${idx}`}
                      className="w-[244px] flex flex-col min-h-[285px]"
                    >
                      <div className="w-full place-content-between relative bg-[#FAFAFA] h-[244px]">
                        <Image
                          fill
                          src={catImages[idx]?.img}
                          alt="category image"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 flex pt-1.5 flex-col gap-1 justify-between">
                        <div className="flex w-full justify-between items-center">
                          <span className="lg:text-[16px] text-[12px] text-nowrap flex gap-2 lg:gap-[12px] items-center text-[#2B2B2B] leading-[100%] tracking-[0%] font-display">
                            {data?.name?.replace("amp;", "")}
                            <GoArrowUpRight className="text-xl lg:text-2xl" />
                          </span>
                          <span className="w-full h-full flex items-end text-[#6C757D] lg:text-[12px] leading-[100%] tracking-[0%] justify-end text-[8px] font-display">
                            NIKE
                          </span>
                        </div>

                        <span className="text-[12px] text-black/50 font-poppins">
                          Made to cater for the finest african hair to nurture
                          your roots and scalps. Best for all hair types...
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
                })}
              </div>
            );
          })}

          {categories?.slice(0,6)?.map((data, idx) => {
            return (
              <div
                key={`${data}--${idx}`}
                className="w-full lg:hidden flex flex-col h-[220px]"
              >
                <div className="w-full place-content-between relative bg-[#FAFAFA] h-[185px]">
                  <Image
                    fill
                    src={catImages[idx]?.img}
                    alt="category image"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex-1 flex justify-between">
                  <span className="text-[12px] flex gap-[6px] items-center text-[#2B2B2B] leading-[100%] tracking-[0%] font-display">
                    {data.name?.replace("amp;","")} <GoArrowUpRight className="text-xl" />
                  </span>
                  <span className="w-fit h-full flex items-end text-[#6C757D] text-[8.61px] leading-[100%] tracking-[0%] font-display">
                    MZIZI
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="lg:w-[514px] lg:h-full w-full h-[65vh] relative">
        <Image
          fill
          src={banner}
          alt="category image"
          className="object-cover object-center"
        />
        <div className="absolute  flex flex-col items-center bottom-16 lg:bottom-24 transform -translate-x-1/2 left-1/2 gap-2 h-auto w-full lg:w-[488px]">
          <h1 className="font-display w-[85%] flex items-center justify-center h-auto text-[18.35px] lg:text-[24px] text-white text-center font-semibold align-middle">
            {bannerText}
          </h1>

          <div className="w-auto flex gap-2.5 lg:gap-10 items-center h-auto">
            {["EXPLORE", "SHOP NOW"].map((con) => {
              return (
                <button key={con} className="w-fit h-fit">
                  <Link
                    href="/"
                    className="lg:w-[136px] w-[110px] h-[33px] lg:h-[43px] border-[1px] border-[#C4C4C4] flex items-center justify-center px-[32px] py-[12px]"
                  >
                    <span className="text-[12.23px] lg:text-[16px] gap-[12px] text-white text-nowrap leading-[100%] tracking-[0%]">
                      {con}
                    </span>
                  </Link>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandShowCase;
