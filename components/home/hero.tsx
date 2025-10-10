import React from "react";
import SearchInput from "./search-input";
import Image from "next/image";
import HeroCarousel from "./hero-carousel";

const Hero = () => {
  return (
    <section
      style={{ perspective: "100vh", transformStyle: "preserve-3d" }}
      className="max-w-screen px-4 relative overflow-hidden pt-[168px] flex flex-col items-center h-screen lg:h-[125vh]"
    >
      <div className="max-w-[890px] left-0 top-0 flex items-center flex-col h-[235px] gap-[14px] lg:gap-[24px]">
        <div className="flex flex-col justify-center items-center gap-[4px] max-w-[890px] max-h-[137px] ">
          <h1 className="font-semibold text-center text-nowrap font-display text-[22.5px] lg:text-[60px] tracking-[0%] leading-[100%] text-[#6A00EF]">
            Discover. Shop. Celebrate Africa.
          </h1>

          <h1 className="max-w-[711px] text-center max-h-[54px]">
            <span className="hidden lg:flex text-[18px] font-poppins font-normal leading-[100%] text-center align-middle -tracking-[0.5%]">
              Explore a curated marketplace of African brands, artisans, and
              entrepreneurs — shop and support Africa’s creativity with every
              purchase.
            </span>
            <span className="text-[13.5px] mt-2 lg:hidden font-poppins font-normal leading-[100%] text-center align-middle -tracking-[0.5%]">
              Explore a curated marketplace of Africa
            </span>
          </h1>
        </div>

        <SearchInput />
      </div>

      <HeroCarousel />

      <div className="absolute bottom-0 w-full h-28 lg:h-52 bg-gradient-to-b from-transparent via-white/30 to-white z-10 left-0"></div>
    </section>
  );
};

export default Hero;
