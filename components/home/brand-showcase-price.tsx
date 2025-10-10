import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import CardOne from "../cards/cardOne";
import { WooProduct } from "@/types";

const BrandShowCasePrice = ({
  product,
  banner,
  bannerText,
  reverseHorizontally,
  reverseVertically,
}: {
  product: WooProduct[];
  banner: string;
  bannerText: string;
  reverseHorizontally?: boolean;
  reverseVertically?: boolean;
}) => {
  return (
    <div
      className={`lg:h-[672px] h-auto overflow-hidden gap-3 mt-32 lg:mt-52 w-full flex ${
        reverseVertically ? "flex-col-reverse" : "flex-col"
      } ${
        reverseHorizontally ? "lg:flex-row-reverse" : "lg:flex-row"
      } justify-between`}
    >
      <div className="w-full lg:flex-1 h-auto flex items-center justify-center p-4">
        <div className="flex-1 grid grid-cols-2 gap-2.5 lg:flex lg:flex-col lg:gap-10 lg:place-content-between">
          {[product.slice(0, 3), product.slice(0, 3)].map((arr, idx) => {
            return (
              <div key={`${idx}`} className="lg:flex hidden w-full lg:gap-6 justify-between items-center h-fit">
                {arr.map((data) => {
                  return <CardOne key={data?.id} data={data} />;
                })}
              </div>
            );
          })}

          {product.map((data) => {
            return (
              <div key={`${data?.id}-mobile`} className="w-full h-auto lg:hidden">
                <CardOne data={data} />
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
          <h1 className="font-display w-[85%] flex items-center justify-center h-auto  text-[18.35px] lg:text-[24px] text-white text-center font-semibold align-middle">
            {bannerText}
          </h1>

          <div className="w-auto flex gap-2.5 lg:gap-10 items-center h-auto">
            {["EXPLORE", "SHOP NOW"].map((con) => {
              return (
                <button key={con} className="w-fit h-fit">
                  <Link
                    href="/"
                    className="lg:w-[136px] w-[110px] h-[33px] lg:h-[43px] border-[2px] lg:border-[1px] border-[#C4C4C4] flex items-center justify-center px-[32px] py-[12px]"
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

export default BrandShowCasePrice;
