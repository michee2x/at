import React from "react";
import BannerCarousel from "../Carousel/BannerCarousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export function Banner() {
  return (
    <div className="w-full relative h-full block bg-blue-600 overflow-hidden">
      <div className="absolute w-[80%] top-4 left-4 z-10 text-xl lg:top-[20%] lg:left-[15%] lg:w-[461px] lg:h-[94px] lg:text-[31px] font-bold text-white leading-tight">
        Efficient and Durable Electronics
      </div>
      <Image
        alt="Atlaze category banner"
        src="/banner/Rectangle%2025.png"
        fill
        className="object-cover lg:object-fill h-full"
        priority
      />
      {/* Hidden on mobile to prevent squashing */}
      <div className="hidden lg:block lg:w-[336px] lg:h-[228px] absolute lg:top-[10%] lg:right-[19%]">
          <Image
            fill
            alt="atlaze electronics category image"
            src="/banner/Group%203.png"
          className="object-cover"
        />
      </div>
      {/* Mobile-optimized footer */}
      <div className="lg:w-[328px] h-auto left-4 lg:left-[15%] items-center lg:items-end bottom-4 lg:bottom-[5%] flex justify-start lg:justify-center lg:h-[46px] absolute">
        <div className="flex gap-2 items-center h-full">
          <div className="w-3 h-3 lg:w-[34px] lg:h-[34px] rounded-full bg-[#FF9900]" />
          <h1 className="text-xs lg:text-[12px] font-bold text-black lg:w-[68px] lg:leading-3.5">
            TOP BRANDS
          </h1>
        </div>
        <div className="w-[1px] h-4 lg:w-[3px] lg:h-[90%] mx-3 bg-black" />
        <div className="flex gap-2 items-center h-full">
          <div className="w-3 h-3 lg:w-[34px] lg:h-[34px] rounded-full bg-[#FF9900]" />
          <h1 className="text-xs lg:text-[12px] font-bold text-black lg:w-[68px] lg:leading-3.5">
            WIDE SELECTION
          </h1>
        </div>
      </div>
    </div>
  );
}

export function BannerTwo() {
  return (
    <section className="bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#c084fc] p-4 lg:p-2 flex items-center w-full h-full relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Left section - text content */}
      <div className="w-[55%] lg:w-[45%] lg:px-10 lg:pt-5 h-full relative z-10 flex flex-col justify-center lg:block pl-2">
        {/* Mobile Badge - Improved Contrast */}
        <div className="lg:hidden mb-1 flex items-center gap-1">
          <span className="bg-[#6a00f3] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            New Season
          </span>
        </div>

        <h3 className="text-gray-900 text-sm lg:text-4xl font-bold leading-tight">
          Own the Look. <br className="lg:hidden" />
          <span className="text-white">Wear Culture.</span>
        </h3>
        
        <p className="hidden lg:flex text-[14px] font-medium font-poppins max-w-[80%] mt-2 text-gray-600">
          Step into the world of African fashion — where every outfit tells a
          story, and every piece is made with pride
        </p>

        {/* Mobile Feature - Darker Text for Contrast */}
        <div className="lg:hidden flex items-center gap-1 mt-1 text-[9px] text-gray-700 font-semibold bg-white/50 w-fit rounded-full px-1">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <span>Premium Fabrics</span>
        </div>

        <Button className="w-fit h-7 px-3 text-[10px] lg:h-12 lg:px-8 lg:text-sm mt-2 lg:mt-6 bg-black hover:bg-gray-900 text-white rounded-lg lg:rounded-full font-semibold shadow-md transition-all hover:scale-105 border border-gray-800">
          Shop Now
          <ArrowRight className="ml-1 lg:ml-2 w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
      </div>

      {/* Right section - Modified to show main image on mobile */}
      <div className="flex w-[45%] lg:flex-1 h-full gap-3 relative z-10">
        {/* Pumpkin - Main Image */}
        <div className="h-full overflow-hidden rounded-xl w-full lg:w-1/2 relative shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 lg:hidden" />
          <Image
            src="/banner/attractive-african-female-wearing-elegant-black-dress-posing-wall.jpg"
            alt="African Fashion"
            fill
            className="object-cover rounded-lg transition-transform duration-700 group-hover:scale-110"
          />
          {/* Mobile floating price/tag - Better Contrast */}
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-bold text-white z-20 lg:hidden shadow-sm border border-white/20">
            From $29
          </div>
        </div>

        <div className="hidden lg:flex flex-col w-1/2 relative">
          {/* Right section - candy boxes + express */}
          <div className="flex h-full flex-col w-full items-center md:items-end">
            <div className="grid grid-cols-2 w-full h-1/2 items-center gap-3">
              <div className="relative overflow-hidden rounded-xl w-full h-full shadow-xl">
                <Image
                  src="/banner/young-woman-wearing-orange-dress-with-turban-ethnic-jewelry.jpg"
                  alt="Ring Pop"
                  fill
                  className="object-cover object-top rounded-xl"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl w-full h-full shadow-xl">
                <Image
                  src="/banner/stunning-young-woman-with-voluminous-curly-hairstyle-elegant-costume-posing.jpg"
                  alt="Twix"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Express Delivery */}
            <div className="w-full h-1/2 pt-2 flex justify-center">
              <div className="bg-white flex h-1/2 w-full text-purple-700 font-semibold px-4 py-2 rounded-lg items-center gap-2 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-yellow-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Express Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BannerThree() {
  return (
    <section className="bg-zinc-900 w-full h-full relative overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Headphones"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent lg:from-black/80 lg:via-black/40" />
      </div>

      <div className="relative z-10 w-full px-4 lg:px-16 flex flex-col justify-center h-full">
        <div className="flex items-center gap-2 mb-2 lg:mb-3">
          <div className="bg-[#6a00f3] text-white text-[9px] lg:text-xs font-bold px-2 py-0.5 lg:px-3 lg:py-1 rounded-full uppercase tracking-wider">
            Premium Audio
          </div>
          {/* Hidden on mobile to save space */}
          <div className="hidden lg:flex text-yellow-500 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
        </div>

        <h2 className="text-xl lg:text-5xl font-bold text-white mb-1 lg:mb-4 tracking-tight leading-tight">
          Sound <span className="text-gray-400 italic">Reimagined.</span>
        </h2>
        
        <p className="text-gray-300 text-[10px] lg:text-lg max-w-[70%] lg:max-w-md line-clamp-2 lg:line-clamp-none mb-3 lg:mb-6 leading-tight">
          Experience crystal clear audio with our new noise-cancelling collection.
        </p>

        <Link href="/categories">
          <Button className="w-fit bg-white text-black hover:bg-gray-100 rounded-full px-4 py-1 h-7 text-[10px] lg:px-8 lg:h-12 lg:text-sm lg:font-semibold">
            Explore Collection 
            <ArrowRight className="ml-1 lg:ml-2 w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

const Carousel = () => {
  return (
    <BannerCarousel
      className="h-[180px] font-display lg:h-[16rem] xl:h-[18rem] 2xl:h-[20rem] rounded-xl overflow-hidden"
      interval={6000}
      slides={[
        {
          id: "1",
          content: (
            <div className="flex-1 flex items-center justify-center font-bold w-full h-full">
              <Banner />
            </div>
          ),
        },
        {
          id: "2",
          content: (
            <div className="flex-1 relative items-center justify-end text-white text-3xl font-bold w-full h-full">
              <BannerTwo />
            </div>
          ),
        },
        {
          id: "3",
          content: (
            <div className="flex-1 relative items-center justify-end text-white text-3xl font-bold w-full h-full">
              <BannerThree />
            </div>
          ),
        },
      ]}
    />
  );
};

export default Carousel;
