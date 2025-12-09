"use client";

import { useSideBar } from "@/contexts/sidebar-context";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoMenuSharp } from "react-icons/io5";
import AlgoliaSearch from "./AlgoliaSearch";
import { useAuth } from "@/contexts/auth-context";
import { signIn } from "next-auth/react";
import Banner from "./home/Banner";
import Link from "next/link"; // <-- added

// Skeleton loader for the image
const SkeletonImage = () => (
  <div className="animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
  </div>
);

const NavBar = ({ showCategories }: { showCategories?: boolean }) => {
  const { setShowSideBar } = useSideBar();
  const { session, isLoading } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    if (session?.user?.image) {
      setImageLoaded(true);
    }
  }, [session]);

  return (
    <div className="w-full border-b-[1.5px] pt-2 lg:pt-0 border-gray-300 z-50 flex flex-col">
      <div className="w-full gap-2 h-[95px] lg:h-[125px] flex flex-col">
        {/* TOP BAR */}
        <div className="lg:min-h-[44px] h-[30px] lg:pt-6 flex justify-between items-center px-4 w-full">
          {/* All Categories → link */}
          <div className="flex text-nowrap lg:h-[5rem] items-center gap-2">
            <Link href="/categories">
              <span className="cursor-pointer">All Categories</span>
            </Link>
          </div>

          {/* TOP MENU RIGHT */}
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

        {/* SEARCH + LOGO AREA */}
        <div className="w-full px-4 mb-2 lg:px-[30px] flex justify-center items-center flex-1">
          <div className="w-full relative flex justify-center items-center h-full">
            <div className="flex w-1/3 flex-1 absolute left-0 -translate-y-1/2 top-1/2 gap-2.5 items-center">
              {/* Sidebar Toggle */}
              <span
                onClick={() => setShowSideBar((prev) => !prev)}
                className="text-[30px] 2xl:text-[40px] cursor-pointer"
              >
                <IoMenuSharp />
              </span>

              {/* Logo + Atlaze text → link to home */}
              <Link href="/" className="w-fit flex items-center gap-0.5">
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
              </Link>
            </div>

            {/* SEARCH BOX */}
            <div className="w-auto hidden lg:block">
              <AlgoliaSearch />
            </div>
          </div>
        </div>
      </div>

      {/* BLACK NAV */}
      <Banner />
    </div>
  );
};

export default NavBar;
