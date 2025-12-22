"use client";

import { useSideBar } from "@/contexts/sidebar-context";
import Link from "next/link";
import React, { useState, useRef } from "react";
import Image from "next/image";
import ParentCategories from "./ParentCategories";
import { WooCategory } from "@/types";
import CategoryInfo from "./CategoryInfo";
import { useAuth } from "@/contexts/auth-context";
import { SidebarSearchParams } from "./SidebarSearchParams";
import { Button } from "@/components/ui/button";
import { X, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const [hoveredCategory, setHoveredCategory] = useState<WooCategory | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const popupTimeout = useRef<NodeJS.Timeout | null>(null);

  const { showSideBar, setShowSideBar } = useSideBar();
  const { session } = useAuth();

  const openPopupWithDelay = (category: WooCategory) => {
    setHoveredCategory(category);

    if (popupTimeout.current) clearTimeout(popupTimeout.current);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setIsPopupOpen(true);
    }, 200);
  };

  const closePopupWithDelay = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (popupTimeout.current) clearTimeout(popupTimeout.current);

    popupTimeout.current = setTimeout(() => {
      setIsPopupOpen(false);
      setHoveredCategory(null);
    }, 300);
  };

  const keepPopupOpen = () => {
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
    setIsPopupOpen(true);
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "GU";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="lg:flex z-[9999]">
      <SidebarSearchParams />
      <nav
        className={`lg:w-[22%] w-[75%] h-screen bg-white flex-col overflow-auto pb-16 flex z-[9999] fixed transition-all duration-300 ${
          showSideBar ? "left-0" : "-left-[100vw]"
        } min-h-screen border-r border-gray-200`}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  className="object-cover"
                  fill
                  alt="atlaze-logo"
                  src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
                />
              </div>
              <h1 className="font-display text-xl italic text-[#2B2B2B]">
                atlaze
              </h1>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSideBar(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div className="p-4">
          <Link
            href="/my-account"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm border-2 border-gray-300">
                {getInitials(session?.user?.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session?.user?.name ?? "Guest User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email ?? "Sign in to continue"}
              </p>
            </div>
          </Link>
        </div>

        <Separator className="my-2" />

        {/* CATEGORIES */}
        <div className="px-4 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Categories
          </h2>
          <div className="flex flex-col gap-1">
            <ParentCategories
              closePopupWithDelay={closePopupWithDelay}
              openPopupWithDelay={openPopupWithDelay}
            />
          </div>
        </div>
      </nav>

      {/* BACKDROP */}
      <div
        onClick={() => setShowSideBar(false)}
        className={`w-screen overflow-hidden fixed transition-all duration-500 h-screen ${
          showSideBar ? "z-[9998] bg-black/50 block" : "-z-40 hidden bg-transparent"
        }`}
      >
        <div className="w-full h-full relative">
          {/* CATEGORY POPUP */}
          <div
            onMouseEnter={keepPopupOpen}
            onMouseLeave={closePopupWithDelay}
            className={`w-[900px] hidden absolute rounded-2xl lg:flex transition-all duration-300 ml-[25%] shadow-2xl ${
              isPopupOpen && showSideBar
                ? "bg-white opacity-100 translate-y-0"
                : "opacity-0 -translate-y-[100vh]"
            } h-[550px] mt-16 border border-gray-200`}
          >
            <div className="w-full rounded-2xl bg-white h-full flex overflow-hidden">
              {hoveredCategory && Object.keys(hoveredCategory).length ? (
                <CategoryInfo category={hoveredCategory} />
              ) : (
                <div className="flex-1 animate-pulse p-8">
                  <div className="w-32 h-6 bg-gray-200 rounded"></div>
                </div>
              )}

              <div className="w-[300px] p-6 bg-gray-50 border-l border-gray-200">
                <div className="relative h-full rounded-xl overflow-hidden">
                  {hoveredCategory?.image?.src ? (
                    <Image
                      src={hoveredCategory.image.src}
                      alt={hoveredCategory.name}
                      className="object-cover"
                      fill
                    />
                  ) : (
                    <div className="size-full bg-gray-200 flex justify-center items-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
