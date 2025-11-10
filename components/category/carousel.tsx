import React from "react";
import BannerCarousel from "../Carousel/BannerCarousel";
import Image from "next/image";

export function Banner() {
  return (
    <div className="w-full relative h-full block  bg-blue-600">
      <div className="absolute w-2/3 top-2 left-2 leading-[1.2rem] lg:leading-[2rem] z-10 text-[20px] lg:top-[20%] lg:left-[15%] lg:w-[461px] lg:h-[94px] lg:text-[31px]">
        Efficient and Durable Electronics
      </div>
      <Image
        alt="Atlaze category banner"
        src="/banner/Rectangle%2025.png"
        fill
        className="object-fill h-full"
      />
      <div className="lg:w-[336px] w-[136px] h-[28px] right-4 top-10 lg:h-[228px] absolute lg:top-[10%] lg:right-[19%]">
        <Image
          fill
          alt="atlaze electronics category image"
          src="/banner/Group%203.png"
          className="object-cover"
        />
      </div>
      <div className="lg:w-[328px] h-auto left-2 lg:left-[15%] items-center lg:items-end bottom-2 lg:bottom-[5%] flex justify-center lg:h-[46px] absolute">
        <div className="lg:w-[107.94px] flex gap-1 items-center h-full">
          <div className="lg:w-[34px] size-[12px] lg:h-[34px] rounded-full bg-[#FF9900]" />
          <h1 className="w-[68px] h-[40px] leading-3.5 text-[12px] font-bold text-black">
            TOP BRANDS
          </h1>
        </div>
        <hr className="lg:w-[3px] w-[1px] h-5 lg:h-[90%] mr-3 bg-black" />
        <div className="w-[107.94px] flex gap-1 items-center h-full">
          <div className="lg:size-[34px] size-[12px] rounded-full bg-[#FF9900]" />
          <h1 className="w-[68px] h-[40px] leading-3.5 text-[12px] font-bold text-black">
            WIDE SELECTION
          </h1>
        </div>
      </div>
    </div>
  );
}
export function BannerTwo() {
  return (
    <section className="bg-purple-700 p-2 flex items-center w-full h-full">
      {/* Left section - pumpkin + bag */}
      <div className="lg:w-[45%] w-[35%] lg:px-10 lg:pt-5 h-full">
        <h3 className="text-[16px] lg:text-4xl">Own the Look. Wear the Culture!</h3>
        <p className="lg:text-[14px] hidden lg:flex font-medium font-poppins max-w-[80%] mt-2 text-white">
          Step into the world of African fashion — where every outfit tells a
          story, and every piece is made with pride
        </p>

        <button className="lg:px-10 px-2 py-1 text-[10px] lg:py-3 lg:text-[14px] mt-4 cursor-pointer bg-white rounded-full text-black">
          shop now
        </button>
      </div>
      <div className="flex-1 h-full gap-1 lg:gap-3 flex">
        {/* Pumpkin */}
        <div className="h-full overflow-hidden rounded-xl w-1/2 relative">
          <Image
            src="/banner/attractive-african-female-wearing-elegant-black-dress-posing-wall.jpg" // replace with actual image path
            alt="Pumpkin"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex-col w-1/2 relative flex">
          {/* Right section - candy boxes + express */}
          <div className="flex h-full flex-col w-full items-center md:items-end">
            <div className="grid grid-cols-2 w-full h-1/2 items-center gap-1 lg:gap-3">
              <div className="relative overflow-hidden rounded-xl w-full h-full">
                <Image
                  src="/banner/young-woman-wearing-orange-dress-with-turban-ethnic-jewelry.jpg" // replace with actual image path
                  alt="Ring Pop"
                  fill
                  className="object-cover object-top rounded-xl"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl w-full h-full">
                <Image
                  src="/banner/stunning-young-woman-with-voluminous-curly-hairstyle-elegant-costume-posing.jpg" // replace with actual image path
                  alt="Twix"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Express Delivery */}
            <div className="w-full h-1/2 pt-2 flex justify-center">
              <div className="bg-white hidden lg:flex h-1/2 w-full text-blue-700 font-semibold px-4 py-2 rounded-lg items-center gap-2 shadow-md">
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


const Carousel = () => {
  return (
    <BannerCarousel
      className="h-28 lg:h-[16rem] xl:h-[18rem] 2xl:h-[20rem] rounded-xl overflow-hidden"
      interval={6000}
      slides={[
        {
          id: "1",
          content: (
            <div className="flex-1 bg-green-500 flex items-center justify-center font-bold w-full h-full">
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
              <BannerTwo />
            </div>
          ),
        },
      ]}
    />
  );
};

export default Carousel;
