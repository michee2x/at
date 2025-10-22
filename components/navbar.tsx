"use client"
import { useSideBar } from "@/contexts/sidebar-context";
import Image from "next/image";
import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { IoMenuSharp } from "react-icons/io5";
import AlgoliaSearch, { ProductHit } from "./AlgoliaSearch";


const NavBar = () => {
  const {setShowSideBar} = useSideBar()
  const [open, setOpen] = useState<boolean>(false);
  const [hits, setHits] = useState<ProductHit[]>([]);
  return (
    <div className="w-full h-auto flex flex-col">
      <div className="w-full z-30 flex flex-col h-[112px]">
        <div className="h-[40px] flex justify-between items-center px-4 w-full">
          <h1 className="h-full aspect-square font-display text-[calc(18/1280 * 100vw)] tracking-[0%] leading-[100%] text-[#2B2B2B] flex items-center justify-center">
            ATLAZE
          </h1>

          <ul className="lg:flex hidden h-[50%] w-fit lg:mr-4">
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

        <div className="w-full px-4 lg:px-[30px] flex justify-center items-center flex-1">
          <div className="w-full relative flex justify-between items-center h-full">
            <div className="flex absolute left-0 -translate-y-1/2 top-1/2 gap-2.5 items-center">
              <span
                onClick={() => setShowSideBar((prev) => !prev)}
                className="text-[30px] 2xl:text-[40px] cursor-pointer"
              >
                <IoMenuSharp />
              </span>

              <span className="text-[(16/1280 * 100vw)] leading-[100%] tracking-[0%] font-display">
                All Categories
              </span>
            </div>

            <div className="w-auto hidden lg:block pt-2 absolute top-0 -translate-x-1/2 left-1/2 min-h-32">
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
      <div className="w-full hidden mt-[10px] px-4 list-none lg:flex mb-6 h-12 items-center justify-between bg-black">
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
