import CardOne from "@/components/cards/cardOne";
import BrandShowCase from "@/components/home/brand-showcase-price";
import BrandShowCasePrice from "@/components/home/brand-showcase";
import CategoryCarousel from "@/components/home/category-carousel";
import Hero from "@/components/home/hero";
import SubCategorySection from "@/components/home/sub-category-section";
import Image from "next/image";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import { GoArrowUpRight } from "react-icons/go";
import ProductList from "@/components/ProductList";

export default function Home() {
  const brandCat = [
    "/home/section%20three/fd358b995b8449a4381fbe07d3c25127ebc9e29c.png",
    "/home/section%20three/fdd060f81b15bfb6600f374dfe97d051289166be.png",
    "/home/section%20three/02aab4ab85b4a2b9c292c3022353c7f5642a3d9a.png",
    "/home/section%20three/02aab4ab85b4a2b9c292c3022353c7f5642a3d9a.png",
    "/home/section%20three/046ffde2c98a7325918870e3515e969f15ec75d6.png",
    "/home/section%20three/046ffde2c98a7325918870e3515e969f15ec75d6.png",
  ];

  const brandCatTwo = [
    "/home/section%20five/d13a027ba3dc9ef468ff6e314758a92dff7416c8.png",
    "/home/section%20five/c816c92c08ab8cd6c6558c456e66271783fab27f.png",
    "/home/section%20five/8bf8be92c6921aa92ce7b93bfd0a03b739c4fd36.png",
    "/home/section%20five/d13a027ba3dc9ef468ff6e314758a92dff7416c8.png",
    "/home/section%20five/c816c92c08ab8cd6c6558c456e66271783fab27f.png",
    "/home/section%20five/8bf8be92c6921aa92ce7b93bfd0a03b739c4fd36.png",
  ];

  const bottles = [
    "/home/bottles/6a27162aeb8a564669fbaffa1b9498416667306c.png",
    "/home/bottles/612809fb272b8dd6ba10ab0679aa4a4338996141.png",
    "/home/bottles/ad1a0261106c2488e880d5ae57c111b7dc38b395.png",
    "/home/bottles/ad1a0261106c2488e880d5ae57c111b7dc38b395.png",
    "/home/bottles/2f5a79d7f0d063cdcc4638c3bb33556b496197af.png",
    "/home/bottles/73ebfa60a5d9c8b3d58bf7cc799d2e772c557dfb.png",
  ];
  return (
    <div className="w-screen flex-col min-h-screen relative flex justify-center">
      <Hero />

      <ProductList
        banner="/home/section%20five/6be3e01dd669b8514f40fdab79d557342ea0f45c.jpg"
        bannerText="EXPLORE THE BEST OF AFRICAN JEWELLERY"
        reverseVertically={true}
        category={22}
      />

      <section className="w-full lg:px-[28px] mt-20 lg:mt-52 min-h-screen flex flex-col items-center">
        <h1 className="text-[20px] lg:text-[42px] font-display text-center w-[1252px] h-[56px] leading-[100%] tracking-[0%] align-middle text-[#000000]">
          Discover the best brands & products <br className="lg:hidden" /> from
          Africa
        </h1>

        <div className="w-full pl-4 h-auto">
          <ul className="list-none w-full gap-[16px] scrollcat items-center mt-5 flex">
            {[
              "Home Decor",
              "Arts & Crafts",
              "Electronics & Gadgets",
              "Women",
              "Beauty & Wellness",
              "Jewelry",
              "Paper & Novelty",
              "Kids & baby",
              "Men",
            ].map((cat) => {
              return (
                <Link
                  key={cat}
                  className={`px-[6px] flex-nowrap lg:px-[8px] flex items-center justify-center ${
                    cat !== "Home Decor"
                      ? "border-[#C4C4C4]"
                      : "border-[#9747FF]"
                  } py-[12px] lg:py-[16px] border-[1px] rounded-[24px] w-fit h-[39px] `}
                  href="/"
                >
                  <span
                    className={`font-poppins ${
                      cat !== "Home Decor" ? "text-[#222222]" : "text-[#9747FF]"
                    }  tracking-[-0.7%] text-nowrap leading-[100%] align-middle text-center text-[12px] lg:text-[15px]`}
                  >
                    {cat}
                  </span>
                </Link>
              );
            })}
          </ul>
        </div>

        <div className="w-full mt-8 h-auto px-4">
          <CategoryCarousel />
        </div>

        {/* <BrandShowCase
          data={brandCatTwo}
          banner="/home/section%20five/6be3e01dd669b8514f40fdab79d557342ea0f45c.jpg"
          bannerText="EXPLORE THE BEST OF AFRICAN JEWELLERY"
          reverseVertically={true}
        /> */}

        <SubCategorySection />

        {/* <BrandShowCasePrice
          data={brandCat}
          banner="/home/section%20three/6939971f273e65575e37ad7fdf4efc69b5aec528%20(1).png"
          bannerText="EXPLORE THE BEST OF AFRICAN FASHION"
          reverseVertically={true}
        />

        <BrandShowCase
          data={bottles}
          banner="/home/bottles/59b73de021e333eda75613c6ac0ec5d1877ef0ac.jpg"
          bannerText="BEAUTY PRODUCTS MADE FOR THE AFRICAN WOMAN"
          reverseVertically={true}
        /> */}

        <div className="h-[1400px] flex items-center gap-4 w-full">
          <div className="w-[800px] relative flex items-center h-[1000px]">
            <Image
              width={400}
              height={813.87}
              src="/home/phones/iPhone%2014%20&%2015%20Pro%20-%2028.png"
              alt="atlaze mobile shopping image"
              className="object-cover absolute z-10 object-center"
            />

            <Image
              width={439}
              height={893}
              src="/home/phones/iPhone%2014%20&%2015%20Pro%20-%2026.png"
              alt="atlaze mobile shopping image"
              className="object-cover absolute object-center right-0"
            />
          </div>
          <div className="flex-1 gap-4 flex items-center">
            <div className="text-[48px] font-display text-[#000000] flex flex-col">
              <h1 className="text-[#D68A36]">ATLAZE</h1>
              <h1 className="text-[#000000] text-end">APP</h1>
            </div>

            <div className="h-[300px] w-[4px] bg-black" />

            <h2 className="font-display w-[323] h-auto text-[21px] leading-[36px] ">
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
