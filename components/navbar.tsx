"use client";

import { useSideBar } from "@/contexts/sidebar-context";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoMenuSharp } from "react-icons/io5";
import AlgoliaSearch from "./AlgoliaSearch";
import { useAuth } from "@/contexts/auth-context";
import { signIn } from "next-auth/react";
import Banner from "./home/Banner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Store, HelpCircle, ShoppingBag, LayoutDashboard, LogOut, ChevronDown, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

// Skeleton loader for the image
const SkeletonImage = () => (
  <div className="animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
  </div>
);

const NavBar = ({ showCategories }: { showCategories?: boolean }) => {
  const { setShowSideBar } = useSideBar();
  const { session, isLoading } = useAuth();
  const { cart} = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

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
      <div className="w-full gap-2 h-[95px] lg:h-[105px] flex flex-col">
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
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="/"
                className="w-fit flex items-center gap-0.5"
              >
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

            {/* User Profile Dropdown */}
            <div className="flex absolute items-center right-0 -translate-y-1/2 top-1/2 gap-4">
              {/* All Categories Link */}
              <Link 
                href="/categories" 
                className="text-sm hidden lg:flex font-medium text-[#2B2B2B] hover:text-[#6a00f3] transition-colors cursor-pointer"
              >
                All Categories
              </Link>

              {/* Cart Icon with Badge */}
              <Link 
                href="/cart" 
                className="relative text-[#2B2B2B] hover:text-[#6a00f3] transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#6a00f3] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isLoading ? (
                <SkeletonImage />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
                      {session.user.image && imageLoaded ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? "User"}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 text-md rounded-full bg-gray-200 flex items-center justify-center font-bold">
                          {getInitials(session.user.name)}
                        </div>
                      )}
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[9999]">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-account" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/stores" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Find a Store</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="cursor-pointer">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Help</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/become-seller" className="cursor-pointer">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Become a Seller</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span onClick={() => signIn()} className="text-sm font-medium text-[#2B2B2B] hover:text-[#6a00f3] transition-colors cursor-pointer">
                  Sign In
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BLACK NAV */}
      <Banner />
    </div>
  );
};

export default NavBar

