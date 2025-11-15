"use client";

import { useSideBar } from "@/contexts/sidebar-context";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { MdRefresh, MdLogout } from "react-icons/md";
import { GiClothes, GiComb } from "react-icons/gi";
import { LuPalette } from "react-icons/lu";
import { PiPlugBold, PiBaby } from "react-icons/pi";
import { RiPaintBrushLine } from "react-icons/ri";
import { IoDiamondOutline } from "react-icons/io5";
import { LiaToolsSolid } from "react-icons/lia";
import { PiBooksDuotone } from "react-icons/pi";
import { MdQueueMusic } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import ParentCategories from "./ParentCategories";
import { WooCategory } from "@/types";
import CategoryInfo from "./CategoryInfo";
import { useSearchParams } from "next/navigation";
import { queryType, useCategory } from "@/contexts/category-context";

const Sidebar = () => {
  const { queryData, setQueryData } = useCategory();
  //Get the search params and store in variables
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const category = searchParams.get("cat");
  const [activeInput, setActiveInput] = useState(false);

  // ⭐ NEW STATES
  const [hoveredCategory, setHoveredCategory] = useState<WooCategory | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const popupTimeout = useRef<NodeJS.Timeout | null>(null);

  const { showSideBar, setShowSideBar } = useSideBar();

  //Set context catId to category id if it changes
  useEffect(() => {
    const catId = category ?? 0;
    const catTitle = title ?? "General";
    const update: queryType = { ...queryData, catId, catTitle };
    setQueryData(update);
  }, [category]);

  const navItems = [
    { src: <GiClothes />, navText: "FASHION" },
    { src: <GiComb />, navText: "BEAUTY & WELLNESS" },
    { src: <LuPalette />, navText: "ART & CRAFTS" },
    { src: <PiPlugBold />, navText: "ELECTRONICS" },
    { src: <RiPaintBrushLine />, navText: "HOME & LIVING" },
    { src: <RiPaintBrushLine />, navText: "FOOD & DRINKS" },
    { src: <IoDiamondOutline />, navText: "JEWELLRIES" },
    { src: <LiaToolsSolid />, navText: "INDUSTRIAL SUPPLIES" },
    { src: <PiBaby />, navText: "BABY & TODDLER" },
    { src: <PiBooksDuotone />, navText: "BOOKS" },
    { src: <MdQueueMusic />, navText: "MUSICAL INSTRUMENTS" },
  ];

  // ⭐ When hovering nav
  const openPopupWithDelay = (category: WooCategory) => {
    setHoveredCategory(category);

    if (popupTimeout.current) clearTimeout(popupTimeout.current);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setIsPopupOpen(true);
    }, 200);
  };

  // ⭐ When mouse leaves nav or popup
  const closePopupWithDelay = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (popupTimeout.current) clearTimeout(popupTimeout.current);

    popupTimeout.current = setTimeout(() => {
      setIsPopupOpen(false);
      setHoveredCategory(null);
    }, 300);
  };

  // ⭐ If popup is hovered → keep open
  const keepPopupOpen = () => {
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
    setIsPopupOpen(true);
  };

  return (
    <div className="lg:flex z-50">
      <nav
        className={`lg:w-[22%] w-[75%] h-screen bg-white flex-col overflow-auto pb-16 font-poppins flex z-[9999] fixed transition-all duration-300 ${
          showSideBar ? "left-0" : "-left-[100vw]"
        } min-h-screen`}
      >
        {/* HEADER + PROFILE */}
        <div className={`w-full px-2 lg:px-4 p-4`}>
          {/* PROFILE (unchanged) */}
          <div className="w-full mt-4 lg:mt-0 min-h-16 lg:min-h-28 flex flex-col place-content-between">
            <div className="w-full flex items-center h-auto">
              <span
                onClick={() => setShowSideBar(false)}
                className="text-xl hidden lg:flex text-black cursor-pointer"
              >
                ◀
              </span>
            </div>

            <div className="w-full flex h-auto">
              <div className="w-2/3 items-center gap-2 flex h-full">
                <img
                  src="/0fe7f6ba74b472666313b2290f18bc2b474b5ded.png"
                  alt="profilepic"
                  className="min-w-12 min-h-12 flex-1 rounded-full object-cover"
                />
                <div className="flex w-full h-full flex-col place-content-between">
                  <span className="text-[#343A40] text-[18px] font-[500]">
                    Michael Israel
                  </span>
                  <span className="text-[#6C757D] text-[12px] font-[400]">
                    michee2x@gmail.com
                  </span>
                </div>
              </div>

              <div className="flex-1 text-xl text-black pr-2 flex items-center justify-end">
                <FiEdit />
              </div>
            </div>
          </div>

          {/* INPUT BOX (unchanged) */}
          <div
            onMouseEnter={() => setActiveInput(true)}
            onMouseLeave={() => setActiveInput(false)}
            className="p-[1.2px] flex place-content-center mt-2 h-[43px] bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-lg"
          >
            <div className="p-2 max-h-[48px] w-full bg-white flex flex-row-reverse items-center gap-3 rounded-lg">
              <input
                type="text"
                className="w-[90%] border-0 bg-transparent outline-none"
                placeholder="Virsual AI Assistant"
              />
              <img
                className="object-cover h-[26px]"
                src="/d49ad3ba235d33ba9a0d6da5cd9ff0aefadb2ca5.png"
                alt="AI logo"
              />
            </div>
          </div>

          {/* CATEGORY NAV */}
          <div className="w-full flex flex-col lg:gap-5.5 gap-2.5 mt-14 h-auto">
            <ParentCategories
              closePopupWithDelay={closePopupWithDelay}
              openPopupWithDelay={openPopupWithDelay}
            />
          </div>
        </div>

        {/* LOGOUT */}
        <div className="w-full h-auto px-4 py-6 absolute lg:relative bottom-0 text-[#2B2B2B] hover:text-[#D68A36] flex items-center gap-1">
          <span className="text-[18px] lg:text-[19px]">
            <MdLogout />
          </span>
          <span className="text-[15px] lg:text-[16px]">Log out</span>
        </div>
      </nav>

      {/* BACKDROP */}
      <div
        onClick={() => setShowSideBar(false)}
        className={`w-screen fixed transition-all duration-500 h-screen ${
          showSideBar ? "z-[9998] bg-gray-900/40" : "-z-40 bg-transparent"
        }`}
      >
        <div className="w-full h-full relative">
          {/* ⭐ CATEGORY POPUP ⭐ */}
          <div
            onMouseEnter={keepPopupOpen}
            onMouseLeave={closePopupWithDelay}
            className={`w-[975px] hidden  absolute gap-8 rounded-xl lg:flex p-4 transition-all duration-300 ml-[25%] ${
              isPopupOpen && showSideBar
                ? "bg-white opacity-100 translate-y-0"
                : "opacity-0 -translate-y-[100vh]"
            } h-[527px] mt-16`}
          >
            {/* your popup content unchanged */}
            <div className="w-full rounded-xl bg-white gap-10 h-full flex">
              {hoveredCategory && Object.keys(hoveredCategory).length ? (
                <CategoryInfo category={hoveredCategory} />
              ) : (
                <div className="flex-1 animate-pulse p-8">
                  <h1 className="w-16 h-4 bg-gray-200"></h1>
                </div>
              )}

              <div className="flex-1 gap-4 rounded-lg p-4 flex">
                <div className="flex-1 rounded-lg overflow-hidden relative">
                  {hoveredCategory?.image?.src ? (
                    <Image
                      src={hoveredCategory.image.src}
                      alt={hoveredCategory.name}
                      className="object-cover aspect-square"
                      fill
                    />
                  ) : (
                    <div className="size-full text-black/60 bg-gray-200 flex justify-center items-center text-[13px]">
                      no image
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH POPUP (unchanged) */}
          <div
            onMouseEnter={() => setActiveInput(true)}
            onMouseLeave={() => setActiveInput(false)}
            className={`w-[450px] z-50 absolute rounded-xl transition-all duration-300 ml-[23%] ${
              activeInput && !showSideBar
                ? "bg-white opacity-100 translate-y-0"
                : "opacity-0 -translate-y-[100vh]"
            } h-[471px]`}
          >
            {/* unchanged search popup */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
