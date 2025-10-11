"use client"

import { useSideBar } from "@/contexts/sidebar-context"
import Link from "next/link"
import Avatar from "@/public/altaze-images/Desktop/Photo (1).png"
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import {FiEdit} from "react-icons/fi"
import {MdRefresh, MdLogout} from "react-icons/md"
import {LiaTshirtSolid} from "react-icons/lia"
import {TfiPaintRoller} from "react-icons/tfi"
import {RiLightbulbFlashLine} from "react-icons/ri"
import {GiHeartNecklace} from "react-icons/gi"
import {FaChevronLeft, FaShoppingBag} from "react-icons/fa"
import {GoArrowUpRight} from "react-icons/go"
import AiImage from "@/public/altaze-images/Desktop/Download_Free_Vectors__Images__Photos___Videos___Vecteezy-removebg-preview 1.png"
import BossManImage from "@/public/altaze-images/mens fashion/Men's Plus Size Tribal Print Patchwork Long Sleeve Shirt 2-Piece Set 1 (1).png"

const Sidebar = () => {
    const [activeInput, setActiveInput] = useState(false)
    const [activeCategory, setActiveCategory] = useState(false)
    const [hoveringCategory, setHoveringCategory] = useState(false)
    const [hoveringInput, setHoveringInput] = useState(false)
    const nav = [
        {icon:<RiLightbulbFlashLine />, name:"ELECTRONICS", link:"/categories/ELECTRONICS"},
        {icon:<TfiPaintRoller />, name:"HOME AND LIVING", link:"/categories/HOME AND LIVING"},
        {icon:<GiHeartNecklace />, name:"JEWELLERIES", link:"/categories/JEWELLERIES"},
        {icon:<FaShoppingBag />, name:"YOUR ORDERS", link:"/orders"}
    ]
    const {showSideBar, setShowSideBar} = useSideBar()

    useEffect(() => {
        console.log("this is sidebar log", showSideBar)
    }, [showSideBar, setShowSideBar])

    if(hoveringCategory){
        setTimeout(() => {
            setHoveringCategory(false)
        }, 2000)
    }

    if(hoveringInput){
        setTimeout(() => {
            setHoveringInput(false)
        }, 2000)
    }

    const navItems = [
      { src: "/sidebar/Vector.png", navText: "FASHION" },
      { src: "/sidebar/Vector%20(1).png", navText: "BEAUTY & WELLNESS" },
      { src: "/sidebar/Vector%20(2).png", navText: "ART & CRAFTS" },
      { src: "/sidebar/Vector%20(3).png", navText: "ELECTRONICS" },
      { src: "/sidebar/Vector%20(4).png", navText: "HOME & LIVING" },
      { src: "/sidebar/Vector.png", navText: "FOOD & DRINKS" },
      { src: "/sidebar/Vector%20(5).png", navText: "JEWELLRIES" },
      { src: "/sidebar/Vector%20(6).png", navText: "INDUSTRIAL SUPPLIES" },
      { src: "/sidebar/Vector%20(7).png", navText: "BABY & TODDLER" },
      { src: "/sidebar/fluent-emoji-high-contrast_books.png", navText: "BOOKS" },
      { src: "/sidebar/Vector%20(8).png", navText: "MUSICAL INSTRUMENTS" },
    ];

  return (
    <>
      <nav
        className={`lg:w-[22%] w-screen flex-col overflow-y-scroll font-display flex bg-transparent z-50 fixed transition-all duration-300 ${
          showSideBar ? "left-0" : "-left-[100vw]"
        } min-h-screen`}
      >
        <div
          className={`w-full  p-4 bg-gray-100 ${
            showSideBar ? "left-0" : "-left-[100vw] lg:-left-[5vw]"
          }`}
        >
          <div className="w-full min-h-28  flex flex-col place-content-between">
            <div className="w-full flex items-center h-auto">
              <span
                onClick={() => setShowSideBar(false)}
                className="text-xl text-black cursor-pointer"
              >
                <FaChevronLeft />
              </span>
            </div>

            <div className="w-full  flex h-auto">
              <div className="w-2/3 items-center gap-2 flex h-full">
                <Image
                  src="/sidebar/0fe7f6ba74b472666313b2290f18bc2b474b5ded.png"
                  alt="profilepic"
                  className="min-w-12 min-h-12 flex-1 rounded-full object-cover"
                  width={14}
                  height={14}
                />
                <div className="flex w-full h-full flex-col place-content-between">
                  <span className="text-[#343A40] text-[18px] font-[500] font-[SF Pro Display]">
                    Michael Israel
                  </span>
                  <span className="text-[#6C757D] text-[12px] font-[400] font-[SF Pro Display]">
                    michee2x@gmail.com
                  </span>
                </div>
              </div>

              <div className="flex-1 text-xl text-black pr-2  flex items-center justify-end">
                <FiEdit />
              </div>
            </div>
          </div>

          <div
            onMouseEnter={() => setHoveringInput(true)}
            className="p-[1.2px] flex place-content-center mt-2 h-[43px] lg:h-[38px] bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-lg"
          >
            <div className="p-2 max-h-[48px] w-full bg-white flex flex-row-reverse items-center gap-3 rounded-lg">
              <input
                type="text"
                className="w-[90%] border-0 bg-transparent outline-none"
                placeholder="Virsual AI Assistant"
              />
              <Image
                className="object-cover"
                src="/home/hero/d49ad3ba235d33ba9a0d6da5cd9ff0aefadb2ca5.png"
                alt="AI logo"
                priority
                height={13}
                width={13}
              />
            </div>
          </div>

          <div className="w-full flex flex-col lg:gap-3 gap-2 mt-14 h-auto">
            {navItems.map((e, i) => {
              return (
                <Link
                  onClick={() => setShowSideBar(false)}
                  href={`/categories/${e.navText.toLowerCase()}`}
                  onMouseEnter={() => setHoveringCategory(true)}
                  key={i}
                  className="w-full text-[#2B2B2B] hover:text-[#D68A36] cursor-pointer h-auto flex items-center gap-5"
                >
                  <Image
                    src={e.src}
                    className="object-cover z-0"
                    alt="nigeria logo"
                    width={18}
                    height={18}
                  />
                  <span className={`text-[15px] lg:text-[16px] ${i === 0 ? "text-[#9747FF]" : ""}`}>{e.navText}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="w-full h-auto px-4 py-6 absolute lg:relative bottom-0 text-[#2B2B2B] hover:text-[#D68A36] flex items-center gap-1">
          <span className="text-[18px] lg:text-[19px]">
            <MdLogout />
          </span>
          <span className="text-[15px] lg:text-[16px]">Log out</span>
        </div>
      </nav>
      <div
        className={`w-screen hidden lg:block fixed overflow-hidden transition-all duration-500 h-screen ${
          showSideBar ? "z-40 bg-gray-900/40" : "-z-40 bg-transparent"
        }`}
      >
        <div className="w-full h-full relative">
          <div
            onMouseEnter={() => setActiveCategory(true)}
            onMouseLeave={() => setActiveCategory(false)}
            className={`w-[975px] absolute  gap-8 rounded-xl flex bg-white overflow p-4 transition-all duration-300 ml-[25%] ${
              (hoveringCategory || activeCategory) && showSideBar
                ? "bg-white"
                : "-translate-y-[100vh]"
            } h-[527px] mt-16`}
          >
            <div className="min-w-1/3 gap-10 h-full flex">
              <div className="flex-1 h-full flex flex-col">
                <div className="w-full h-auto py-2 mb-3 border-b-2 font-[500] text-nowrap text-[13.44px] border-gray-800">
                  MOST POPULAR CATEGORIES
                </div>
                {[1, 2, 3, 4, 5, 6, 7].map((e) => {
                  return (
                    <span
                      key={e}
                      className="text-[#2B2B2B] flex items-center gap-2 p-2 text-[11.94px] font-[Red Hat Display]"
                    >
                      <span className="text-[11.94px]">MEN’S CLOTHING</span>
                      <span className={`text-[12px]`}>
                        <GoArrowUpRight />
                      </span>
                    </span>
                  );
                })}
              </div>
              <div className="flex-1 h-full flex flex-col">
                <div className="w-full h-auto py-2 mb-3 border-b-2 font-[500] text-nowrap text-[13.44px] border-gray-800">
                  MOST POPULAR CATEGORIES
                </div>
                {[1, 2, 3, 4].map((e) => {
                  return (
                    <span
                      key={e}
                      className="text-[#2B2B2B] flex items-center gap-2 p-2 text-[11.94px] font-[Red Hat Display]"
                    >
                      <span className={`${!showSideBar && "-z-40"}`}>
                        MEN’S CLOTHING
                      </span>
                      <span
                        className={`${showSideBar ? "text-[12px]" : "-z-40"}`}
                      >
                        <GoArrowUpRight />
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="w-[467px] h-[278px] rounded-lg bg-[#DEB98F] p-4 flex">
              <div className="flex-1">
                <p className="font-[500] font-[Red Hat Display] text-nowrap text-[13.44px]">
                  THE BEST FASHION ITEMS & <br /> CONCEPTS FROMTHE SUB-
                  <br />
                  SAHARAN
                </p>
                <button className="bg-[#2B2B2B] mt-3 text-white w-40 h-10 rounded-lg justify-center flex items-center gap-1 p-2 text-[11.94px] font-[Red Hat Display]">
                  <span className="text-[10.45px]">Expore all categories</span>
                  <span className={`text-[12px]`}>
                    <GoArrowUpRight />
                  </span>
                </button>
              </div>

              <Image
                src="/home/hero/Frame%201000003698.png"
                className="bg-cover"
                alt="bossmanimage"
                width={500}
                height={500}
              />
            </div>
          </div>

          <div
            onMouseEnter={() => setActiveInput(true)}
            onMouseLeave={() => setActiveInput(false)}
            className={`w-[450px] z-50 absolute  gap-8 rounded-xl flex bg-transparent overflow transition-all duration-300 ml-[23%] ${
              (activeInput || hoveringInput) && !showSideBar
                ? "bg-white"
                : "-translate-y-[100vh]"
            } h-[471px]`}
          >
            <div
              className={`w-full flex items-center justify-between p-4 py-6 border-b-2 border-gray-200 h-8`}
            >
              <span className="text-[#D68A36] text-[14px]">ATLAZE</span>
              <span className="text-gray-600 text-xl">
                <MdRefresh />
              </span>
            </div>
            <div className="w-full min-h-16 px-4 absolute bottom-0">
              <div className="p-[1.2px] flex place-content-center h-[43px] lg:h-[38px] bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-lg">
                <div className="px-6 max-h-[48px] w-full bg-white flex flex-row-reverse items-center gap-3 rounded-lg">
                  <input
                    type="text"
                    className="w-full border-0 bg-transparent outline-none"
                    placeholder="search by keywords or upload/take photo"
                  />
                </div>
              </div>

              <div className="w-full flex flex-row gap-6 py-2 h-auto">
                {[1, 2, 3].map((e) => {
                  return (
                    <span
                      key={e}
                      className="w-1/3 border-2 p-1 rounded-lg border-[#D4D4D4] items-center gap-2 flex"
                    >
                      <p className="lg:p-[11px] p-[10px] bg-gradient-to-r rounded-full from-[#EBCC97] to-[#9747FF]"></p>
                      <span className="text-[10px] text-[#9747FF] font-[400]">
                        upload a photo
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar