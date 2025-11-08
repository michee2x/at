"use client"
import { useSideBar } from "@/contexts/sidebar-context";
import Image from "next/image";
import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { IoMenuSharp } from "react-icons/io5";
import AlgoliaSearch, { ProductHit } from "./AlgoliaSearch";
import { usePathname } from "next/navigation";
import AllCategoryModal from "./AllCategoryModal";
import { FaChevronUp } from "react-icons/fa6";


const NavBar = ({showCategories}:{showCategories?:boolean}) => {
  const pathname = usePathname();
  const {setShowSideBar} = useSideBar()

  const pages = [
    "search",
  ] as const;

  const status = Object.fromEntries(
    pages.map((page) => [page, pathname?.includes(page)])
  );

  // Usage:
  const { search } = status;

  return (
    <div className={`w-full z-50 h-auto flex flex-col`}>
      <div className="w-full gap-2 z-20 flex flex-col h-[125px]">
        <div className="lg:h-[44px] min-h-[25px] lg:pt-5 flex justify-between items-center px-4 w-full">
          <div className="flex text-nowrap h-[5rem] items-center gap-2">
            All Categories
          </div>

          <ul className="lg:flex hidden h-[50%] w-fit">
            {["Find a Store", "Help", "Become a Seller", "Sign In"].map(
              (text, idx) => {
                return (
                  <li
                    className={`text-[calc(12/1280*100vw)] h-full w-fit px-4 flex items-center justify-center ${
                      idx === 3 ? "" : "border-r-[1.5px]"
                    } text-[#2B2B2B]`}
                    key={text}
                  >
                    {text}
                  </li>
                );
              }
            )}
          </ul>
        </div>

        <div className="w-full px-4 mb-2 lg:px-[30px] flex justify-center items-center flex-1">
          <div className="w-full relative flex justify-center items-center h-full">
            <div className="flex w-1/3 flex-1 absolute left-0 -translate-y-1/2 top-1/2 gap-2.5 items-center">
              <span
                onClick={() => setShowSideBar((prev) => !prev)}
                className="text-[30px] 2xl:text-[40px] cursor-pointer"
              >
                <IoMenuSharp />
              </span>

              <div className="w-fit flex items-center gap-0.5">
                <div className="lg:size-[2rem] size-[1.8rem] relative">
                  <Image
                    className="object-cover"
                    fill
                    alt="atlaze-logo"
                    src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
                  />
                </div>
                <h1 className="h-full aspect-square font-display text-[calc(18/1280 * 100vw)] tracking-[0%] leading-[100%] text-2xl italic text-[#2B2B2B] flex items-center justify-center">
                  atlaze
                </h1>
              </div>
            </div>

            <div className="w-auto hidden lg:block">
              <AlgoliaSearch />
            </div>

            <div className="flex absolute right-0 -translate-y-1/2 top-1/2 items-center gap-3.5">
              <div className="flex gap-2 items-center">
                <Image
                  src="/home/hero/Nigeria.png"
                  className="object-cover z-0"
                  alt="nigeria logo"
                  width={24}
                  height={24}
                />
                <span className="leading-[24px] hidden lg:flex tracking-[-0.5%] text-[16px] text-[#0E0F0C] ">
                  NGN
                </span>
                <span className="text-[14px] hidden lg:flex leading-[22px] tracking-[1%] text-[#454745]">
                  Naira
                </span>
              </div>
              {[
                "/home/vector icons/Vector.png",
                "/home/vector icons/Vector (1).png",
                "/home/vector icons/Vector (2).png",
              ].map((src, idx) => {
                return (
                  <Image
                    width={19}
                    height={14.5}
                    src={src}
                    alt="love icon"
                    key={src}
                    className={`${idx === 0 ? "hidden" : "flex"}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full hidden px-4 list-none lg:flex h-12 items-center justify-between bg-black">
        {[
          "TODAY'S DEALS",
          "WEEKLY DEALS",
          "BUNDLE DEALS",
          "TOP BRANDS",
          "BEST SELLERS",
          "NEW ARRIVALS",
          "COMING SOON",
        ].map((e) => {
          return (
            <li key={e} className="text-[#FFFFFF] text-[14px]">
              {e}
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;
