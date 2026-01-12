"use client"
import { useFilter } from "@/contexts/filter-context";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { CiCircleInfo } from "react-icons/ci";

const SearchInput = () => {
  const {setShowAlgoliaSearch} = useFilter()
  return (
    <section className="w-fit h-fit">
      {/* Outer gradient border container */}
      <div className="lg:w-[calc(612/1280*100vw)] sm:w-[calc(562/1280*100vw)] md:w-[calc(512/1280*100vw)] lg:h-[60px] w-[90vw] max-w-[400px] md:max-w-none h-[48px] bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-[36px] p-[2px]">
        {/* Inner white container */}
        <div className="w-full h-full bg-white rounded-[34px] flex items-center px-1.5 lg:px-3 gap-2 lg:gap-3">
          <span className="flex shrink-0 size-[32px] lg:size-[36px] items-center justify-center bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-full">
            <Image
              alt="atlaze AI search logo"
              src="/home/vector%20icons/Vector%20(9).png"
              width={14}
              height={14}
              className="w-3.5 h-3.5 lg:w-4 lg:h-4"
            />
          </span>

          <div onClick={() => setShowAlgoliaSearch(true)} className="flex-1 cursor-text truncate text-[13px] lg:text-[14px] text-[#6C757D] font-poppins">
            Search by keywords or upload...
          </div>

          <div className="shrink-0 relative w-8 h-8 lg:w-9 lg:h-9">
            <Image
              alt="atlaze AI search logo"
              src="/home/hero/d49ad3ba235d33ba9a0d6da5cd9ff0aefadb2ca5.png"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-1 justify-center mt-2 items-center">
        <CiCircleInfo className="text-[#6C757D]" />
        <span className="text-[11px] italic text-[#6C757D] font-poppins">
          AI assisted search engine
        </span>
      </div>
    </section>
  );
};

export default SearchInput;
//https://www.figma.com/design/E75rN8nKlexn3ivqEOeinI/Atlaze--E-commerce?node-id=1510-809&t=IdUpMIhsoWxkXOjc-0