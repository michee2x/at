"use client";

import { useSideBar } from "@/contexts/sidebar-context";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoMenuSharp } from "react-icons/io5";
import AlgoliaSearch from "./AlgoliaSearch";
import { useAuth } from "@/contexts/auth-context"; // Import the auth context
import { signIn } from "next-auth/react";

// Skeleton loader for the image
const SkeletonImage = () => (
  <div className="animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
  </div>
);

const NavBar = ({ showCategories }: { showCategories?: boolean }) => {
  const { setShowSideBar } = useSideBar();
  const { session, isLoading } = useAuth(); // Access session from context
  const [imageLoaded, setImageLoaded] = useState(false); // Track if the image has loaded

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    if (session?.user?.image) {
      setImageLoaded(true); // Mark image as loaded if session user has an image
    }
  }, [session]);

  return (
    <div className="w-full border-b-[1.5px] pt-2 lg:pt-0 border-gray-300 z-50 flex flex-col">
      <div className="w-full gap-2 h-[95px] lg:h-[125px] flex flex-col">
        <div className="lg:min-h-[44px] h-[30px] lg:pt-6 flex justify-between items-center px-4 w-full">
          <div className="flex text-nowrap lg:h-[5rem] items-center gap-2">
            All Categories
          </div>

          {/* TOP MENU */}
          <ul className="lg:flex hidden h-[50%] w-fit">
            {["Find a Store", "Help", "Become a Seller"].map((item) => (
              <li
                key={item}
                className="text-[calc(12/1280*100vw)] h-full w-fit px-4 flex items-center justify-center border-r-[1.5px] text-[#2B2B2B]"
              >
                {item}
              </li>
            ))}

            {/* User / Sign In */}
            <li className="text-[calc(12/1280*100vw)] h-full w-fit px-4 flex items-center justify-center text-[#2B2B2B] cursor-pointer">
              {isLoading ? (
                <SkeletonImage />
              ) : session?.user ? (
                <div className="flex items-center gap-2">
                  {/* Display user's profile image or initials */}
                  {session.user.image && imageLoaded ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {getInitials(session.user.name)}
                    </div>
                  )}
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
                <div className="relative size-8">
                  <Image
                    className="object-cover"
                    fill
                    alt="atlaze-logo"
                    src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
                  />
                </div>
                <h1 className="h-full aspect-square font-display text-2xl italic text-[#2B2B2B] flex items-center justify-center">
                  atlaze
                </h1>
              </div>
            </div>

            {/* SEARCH BOX */}
            <div className="w-auto hidden lg:block">
              <AlgoliaSearch />
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
        ].map((e) => (
          <li key={e} className="text-[#FFFFFF] text-[14px]">
            {e}
          </li>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
