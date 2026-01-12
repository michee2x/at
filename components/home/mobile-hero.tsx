import React from "react";
import SearchInput from "./search-input";
import Image from "next/image";
import Link from "next/link";

const MobileHero = () => {
    const images = [
        {
            src: "/home/hero/27e49ba5c91c1af8960a1ac7dcc2d147692bfa96%20(1).jpg",
            link: "/categories/?cat=76&title=Revamp your home in style",
        },
        {
            src: "/home/hero/Frame%201000003698.png",
            link: "/categories/?cat=75&title=Great Sound and Headphones"
        },
        {
            src: "/home/hero/Frame%201000003699.png",
            link: "/categories/?cat=80&title=Styles for Women"
        },
        {
            src: "/home/hero/Frame%201000003700.png",
            link: "/categories/?cat=77&title=Appliances"
        },
        {
            src: "/home/hero/Frame%201000003703.png",
            link: "/categories/?cat=81&title=Home Accessories"
        },
        {
            src: "/home/hero/da264833a58db801ba764ae613cfba43c5dc08f3%20(1).jpg",
            link: "/categories/?cat=78&title=Accessories"
        },
    ];

    return (
        <section className="w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center pt-[90px] pb-0 gap-6 overflow-hidden relative">
            {/* Header Section */}
            <div className="flex flex-col items-center px-4 gap-4 w-full z-10">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="font-bold text-[28px] leading-[1.2] text-center font-display text-[#6A00EF]">
                        Discover. Shop. Celebrate Africa.
                    </h1>
                    
                    <p className="text-[14px] text-center text-gray-600 font-poppins leading-[1.5] max-w-[320px]">
                        Explore a curated marketplace of Africa.
                    </p>
                </div>

                <div className="w-full flex justify-center scale-95 origin-top">
                     <SearchInput />
                </div>
            </div>

            {/* Static Grid Layout */}
            <div className="w-full relative px-4 mt-2">
               <div className="grid grid-cols-2 gap-3 w-full">
                 {images.slice(0, 4).map((img, idx) => (
                    <Link 
                        key={`${img.src}-${idx}`}
                        href={img.link} 
                        className="relative block aspect-[3/4] w-full rounded-[20px] overflow-hidden shadow-sm bg-gray-100"
                    >
                        <Image
                            src={img.src}
                            fill
                            alt="Hero Image"
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            priority={idx < 2}
                        />
                    </Link>
                 ))}
               </div>
               
               {/* Bottom Blur Effect */}
               <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
};

export default MobileHero;
