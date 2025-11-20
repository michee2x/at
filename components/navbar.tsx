"use client";

import { useSideBar } from "@/contexts/sidebar-context";
import Image from "next/image";
import React from "react";
import { IoMenuSharp } from "react-icons/io5";
import AlgoliaSearch from "./AlgoliaSearch";
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

const NavBar = ({ showCategories }: { showCategories?: boolean }) => {
  const pathname = usePathname();
  const { setShowSideBar } = useSideBar();
  const { data: session } = useSession();

  return (
    <div
      className={`w-full border-b-[1.5px] border-gray-300 z-50 h-auto flex flex-col`}
    >
      {/* TOP BAR */}
      <div className="w-full gap-2 h-[100px] z-20 flex flex-col lg:h-[125px]">
        <div className="lg:min-h-[44px] h-[50px] lg:pt-6 flex justify-between items-center px-4 w-full">
          <div className="flex text-nowrap h-[5rem] items-center gap-2">
            All Categories
          </div>

          {/* TOP MENU */}
          <ul className="lg:flex hidden h-[50%] w-fit">
            {/* Find a Store */}
            <li className="text-[calc(12/1280*100vw)] h-full w-fit px-4 flex items-center justify-center border-right-[1.5px] text-[#2B2B2B] border-r-[1.5px]">
              Find a Store
            </li>

            {/* Help */}
            <li className="text-[calc(12/1280*100vw)] h-full w-fit px-4 flex items-center justify-center border-right-[1.5px] text-[#2B2B2B] border-r-[1.5px]">
              Help
            </li>

            {/* Become a Seller */}
            <li className="text-[calc(12/1280*100vw)] h-full w-fit px-4 flex items-center justify-center border-right-[1.5px] text-[#2B2B2B] border-r-[1.5px]">
              Become a Seller
            </li>

            {/* 🔥 Sign In OR User Icon */}
            <li className="text-[calc(12/1280*100vw)] h-full w-fit px-4 flex items-center justify-center text-[#2B2B2B] cursor-pointer">
              {session ? (
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/user.png"
                    width={22}
                    height={22}
                    alt="user"
                    className="rounded-full"
                  />
                  <span>{session.user?.name?.split(" ")[0]}</span>
                </div>
              ) : (
                <span onClick={() => signIn()}>Sign In</span>
              )}
            </li>
          </ul>
        </div>

        {/* SEARCH + LOGO */}
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

            {/* SEARCH BOX */}
            <div className="w-auto hidden lg:block">
              <AlgoliaSearch />
            </div>

            {/* RIGHT ICONS */}
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

      {/* BLACK NAV */}
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
