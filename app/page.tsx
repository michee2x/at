"use client"

import DiverseCategoryCarousel from "@/components/CategoryCarousel";
import CategoryCarousel from "@/components/home/category-carousel";
import Hero from "@/components/home/hero";
import Image from "next/image";
import Link from "next/link";
import ProductList from "@/components/ProductList";
import { useCategory } from "@/contexts/category-context";
import CategoryButton from "@/components/skeletons/category-button";
import CategoryGrid from "@/components/CategoryGrid";
import HeadphoneGrid from "@/components/HeadPhoneGrid";

export default function Home() {
  const { categories } = useCategory();

  return (
    <div className="w-screen items-center flex-col min-h-screen relative flex justify-center">
      <Hero />

      <section className="w-full md:max-w-[95%] lg:max-w-full xl:max-w-[1300px] 2xl:max-w-[1440px]  xl:px-[28px] lg:px-[16px] mt-20 lg:mt-32 min-h-screen flex flex-col items-center">
        <CategoryGrid />
        <h1 className="text-[20px] hidden lg:order-1 lg:text-[clamp(1.5rem, 2vw + 1rem, 3rem)] font-display text-center w-full lg:w-[1252px] h-[56px] leading-[100%] tracking-[0%] align-middle text-[#000000]">
          Discover the best brands & products <br className="lg:hidden" /> from
          Africa
        </h1>

        <div className="w-full hidden h-auto lg:order-2">
          <div className="w-full pl-4 h-auto">
            <ul className="list-none w-full gap-[16px] scrollcat lg:justify-center items-center mt-5 flex">
              {categories?.length > 0 ? (
                categories?.map((cat, idx) => {
                  return (
                    <Link
                      key={cat?.name}
                      className={`px-[6px] flex-nowrap lg:px-[8px] flex items-center justify-center ${
                        idx !== 0 ? "border-[#C4C4C4]" : "border-[#9747FF]"
                      } py-[12px] lg:py-[16px] border-[1px] rounded-[24px] w-fit h-[39px] `}
                      href="/"
                    >
                      <span
                        className={`font-poppins ${
                          idx !== 0 ? "text-[#222222]" : "text-[#9747FF]"
                        }  tracking-[-0.7%] text-nowrap leading-[100%] align-middle text-center text-[12px] lg:text-[15px]`}
                      >
                        {cat?.name?.replace("amp;", "")}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <CategoryButton />
              )}
            </ul>
          </div>

          <div className="w-full mt-8 h-auto px-4">
            <CategoryCarousel />
          </div>
        </div>

        {/* <CategoryList
          banner="/home/section%20three/6939971f273e65575e37ad7fdf4efc69b5aec528%20(1).png"
          bannerText="EXPLORE THE BEST OF AFRICAN FASHION"
          reverseVertically={true}
          category={22}
          className="lg:order-3"
        /> */}

        <ProductList
          banner="/home/section%20three/6939971f273e65575e37ad7fdf4efc69b5aec528%20(1).png"
          bannerText="EXPLORE THE BEST OF AFRICAN FASHION"
          reverseVertically={true}
          category={99}
          className="lg:order-3"
        />

        <ProductList
          banner="/home/bottles/59b73de021e333eda75613c6ac0ec5d1877ef0ac.jpg"
          bannerText="BEAUTY PRODUCTS MADE FOR THE AFRICAN WOMAN"
          reverseVertically={true}
          reverseHorizontally={true}
          category={21}
          className="lg:order-6 mt-16"
          newProduct={true}
        />

        <div className="w-full lg:order-7 h-auto mt-16">
          <HeadphoneGrid />
        </div>

        <div className="lg:h-[800px] lg:order-8 g-[#FAFAFA] min-h-[700px] my-20 py-12 flex flex-col lg:flex-row items-center gap-14 md:gap-0 w-full">
          <div className="lg:w-[800px] sm:w-[40%] md:w-[80%] h-[60vh] w-full relative flex items-center lg:h-[1000px] md:h-[700px]">
            <div className="md:w-[400px] md:scale-[0.7] sm:left-[40%]  -translate-x-1/2 left-[30%] h-[370px] w-[180px] md:h-[813.37px] absolute z-10">
              <Image
                fill
                src="/at-phone/iPhone%2014%20&%2015%20Pro%20-%2026.png"
                alt="atlaze mobile shopping image"
                className="object-cover object-center"
              />
            </div>
            <div className="md:w-[439px] md:scale-[0.7] sm:left-[60%] -translate-x-1/2 left-[65%] h-[413px] w-[200px] md:h-[893px] absolute">
              <Image
                fill
                src="/at-phone/iPhone%2014%20&%2015%20Pro%20-%2028.png"
                alt="atlaze mobile shopping image"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="md:flex-1 px-4 w-full h-auto gap-4 flex justify-center lg:justify-start items-center">
            <div className="lg:text-[48px] text-[28px] font-display text-[#000000] flex flex-col">
              <h1 className="text-[#D68A36]">ATLAZE</h1>
              <h1 className="text-[#000000] text-end">APP</h1>
            </div>

            <div className="lg:h-[300px] h-[230px] w-[2.5px] lg:w-[3px] bg-black" />

            <h2 className="font-display w-[323] h-auto text-[14px] md:text-[18px] lg:text-[21px] lg:leading-[36px] ">
              DISCOVER THE{" "}
              <span className="font-bold text-[#D68A36]">ATLAZE</span>{" "}
              <span className="font-bold text-[#000000]">APP.</span> <br />{" "}
              <span className="mt-4 flex">
                AVAILABLE NOW ON THE APP STORE AND GOOGLE PLAY STORE
              </span>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
