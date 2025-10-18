import React from "react";
import SearchInput from "./search-input";
import Image from "next/image";
import HeroCarousel from "./hero-carousel";

const Hero = () => {
  return (
    <section
      style={{ perspective: "100vh", transformStyle: "preserve-3d" }}
      className="max-w-screen w-full h-[720px] bg-gradient-to-b from-transparent via-gray-100 to-gray-300 px-4 relative overflow-hidden sm:h-[calc(1300/1600*100vw)] pt-[168px] flex flex-col items-center md:h-[calc(1300/1600*100vw)] lg:h-[calc(1180/1600*100vw)] xl:h-[calc(1100/1600*100vw)] 2xl:h-[calc(1000/1600*100vw)]"
    >
      <div className="left-0 max-w-screen top-0 flex items-center flex-col h-[235px] gap-[14px] lg:gap-[24px]">
        <div className="flex flex-col justify-center items-center gap-[4px]  max-h-[137px] ">
          <h1 className="font-semibold text-[22.5px] text-center text-nowrap font-display sm:text-[clamp(22.5, calc(22.5/1280*100vw), 60)] sm:text-[calc(60/1280*100vw)] tracking-[0%] leading-[100%] text-[#6A00EF]">
            Discover. Shop. Celebrate Africa.
          </h1>

          <h1 className="max-w-[711px] text-center max-h-[54px]">
            <span className="hidden sm:flex text-[12px] lg:text-[15px] font-poppins font-normal leading-[100%] text-center sm:max-w-xl align-middle -tracking-[0.5%]">
              Explore a curated marketplace of African brands, artisans, and
              entrepreneurs — shop and support Africa’s creativity with every
              purchase.
            </span>
            <span className="text-[13.5px] mt-2 sm:hidden font-poppins font-normal leading-[100%] text-center align-middle -tracking-[0.5%]">
              Explore a curated marketplace of Africa
            </span>
          </h1>
        </div>

        <SearchInput />
      </div>

      <HeroCarousel />

      <div className="absolute h-24 backdrop-blur-[0.2px] sm:h-[calc(280/1440*100vw)] sm:flex md:h-[calc(350/1440*100vw)] 2xl:text-2x bottom-0 w-full lg:h-[calc(354/1440*100vw)] xl:h-[calc(184/800*100vw)] bg-gradient-to-b from-transparent via-white/60 to-white z-10 left-0">
        <div className="absolute bottom-0 w-full h-full xl:h-[80%] 2xl:h-full bg-gradient-to-b from-transparent to-white"></div>
      </div>
    </section>
  );
};

export default Hero;

