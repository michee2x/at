import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";

const BrandShowCasePrice = ({
  data,
  banner,
  bannerText,
  reverseHorizontally,
  reverseVertically,
}: {
  data: string[];
  banner: string;
  bannerText: string;
  reverseHorizontally?: boolean;
  reverseVertically?: boolean;
}) => {
  return (
    <div
      className={`lg:h-[672px] h-auto overflow-hidden gap-3 mt-52 w-full flex ${
        reverseVertically ? "flex-col-reverse" : "flex-col"
      } ${
        reverseHorizontally ? "lg:flex-row-reverse" : "lg:flex-row"
      } justify-between`}
    >
      <div className="w-full h-auto flex items-center justify-center p-4">
        <div className="flex-1 grid grid-cols-2 gap-2.5 lg:gap-5 lg:flex lg:flex-col lg:place-content-between">
          {[data.slice(0, 3), data.slice(3, 6)].map((arr) => {
            return (
              <div className="lg:flex hidden w-full justify-between items-center h-fit">
                {arr.map((data) => {
                  return (
                    <div className="w-[244px] flex flex-col h-[285px]">
                      <div className="w-full place-content-between relative bg-[#FAFAFA] h-[244px]">
                        <Image
                          fill
                          src={data}
                          alt="category image"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <span className="text-[16px] flex gap-[12px] items-center text-[#2B2B2B] leading-[100%] tracking-[0%] font-display">
                          MZIZI JERSEY <GoArrowUpRight className="text-2xl" />
                        </span>
                        <span className="w-fit h-full flex items-end text-[#6C757D] text-[12px] leading-[100%] tracking-[0%] font-display">
                          MZIZI
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {data.map((data) => {
            return (
              <div className="w-full lg:hidden flex flex-col h-[220px]">
                <div className="w-full place-content-between relative bg-[#FAFAFA] h-[185px]">
                  <Image
                    fill
                    src={data}
                    alt="category image"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex-1 flex justify-between">
                  <span className="text-[12px] flex gap-[6px] items-center text-[#2B2B2B] leading-[100%] tracking-[0%] font-display">
                    MZIZI JERSEY <GoArrowUpRight className="text-xl" />
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
        <div className="absolute  flex flex-col items-center bottom-24 transform -translate-x-1/2 left-1/2 gap-2 h-auto w-full lg:w-[488px]">
          <h1 className="font-display w-[90%] flex items-center justify-center h-auto text-[18.35px] lg:text-[24px] text-white text-center font-semibold align-middle">
            {bannerText}
          </h1>

          <div className="w-auto flex gap-2.5 lg:gap-10 items-center h-auto">
            {["EXPLORE", "SHOP NOW"].map((con) => {
              return (
                <button key={con} className="w-fit h-fit">
                  <Link
                    href="/"
                    className="w-[136px] h-[43px] border-[1px] border-[#C4C4C4] flex items-center justify-center px-[32px] py-[12px]"
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
