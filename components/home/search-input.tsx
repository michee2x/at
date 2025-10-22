"use client"
import { useFilter } from "@/contexts/filter-context";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { CiCircleInfo } from "react-icons/ci";

const SearchInput = () => {
  const {setShowAlgoliaSearch} = useFilter()
  return (
    <section className="w-fit h-fit">
      <div className="lg:w-[calc(612/1280*100vw)] sm:w-[calc(562/1280*100vw)] md:w-[calc(512/1280*100vw)] lg:h-[60px] w-[90vw] h-[44px] relative bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-[36px] p-[1.5px]">
        <div className="sm:w-[calc(558/1280*100vw)] inset-0 lg:w-[calc(608/1280*100vw)] md:w-[calc(508/1280*100vw)] w-[89vw] h-[40px] lg:h-[56px] flex items-center absolute transform -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 gap-3 p-[6px] lg:p-[12px] rounded-[36px] bg-white">
          <span className="flex size-[28px] items-center justify-center bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-full">
            <Image
              alt="atlaze AI search logo"
              src="/home/vector%20icons/Vector%20(9).png"
              width={12}
              height={12}
            />
          </span>

          <div onClick={() => setShowAlgoliaSearch(true)} className="flex-1 border-0 outline-0 align-middle text-[14px] tracking-[0%] leading-[100%] text-[#6C757D]">
            Search by keywords or upload...
        </div>

          <Image
            alt="atlaze AI search logo"
            src="/home/hero/d49ad3ba235d33ba9a0d6da5cd9ff0aefadb2ca5.png"
            width={36}
            height={36}
          />
        </div>
      </div>
      <span className="flex gap-[1.5px] items-center">
        <CiCircleInfo />
        <span className="text-[10px] mt-1 italic text-[#6C757D] tracking-[0%] leading-[100%]">
          AI assisted search engine
        </span>
      </span>
    </section>
  );
};

export default SearchInput;
//https://www.figma.com/design/E75rN8nKlexn3ivqEOeinI/Atlaze--E-commerce?node-id=1510-809&t=IdUpMIhsoWxkXOjc-0