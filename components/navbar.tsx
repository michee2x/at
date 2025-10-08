import Image from "next/image";
import React from "react";
import { IoMenuSharp } from "react-icons/io5";

const NavBar = () => {
  return (
    <div className="w-full hidden lg:flex flex-col h-[112px] absolute">
      <div className="h-[40px] flex justify-between items-center px-4 w-full">
        <h1 className="h-full aspect-square font-display text-[18px] tracking-[0%] leading-[100%] text-[#2B2B2B] flex items-center justify-center">
          ATLAZE
        </h1>

        <ul className="flex h-[50%] w-fit mr-4">
          {["Find a Store", "Help", "Become a Seller", "Sign In"].map(
            (text, idx) => {
              return (
                <li
                  className={`text-[12px] h-full w-fit px-4 flex items-center justify-center ${
                    idx === 3 ? "" : "border-r-[1.5px]"
                  } text-[#2B2B2B]`}
                  key={text}
                >
                  {text}
                </li>
              );
            }
          )}
        </ul>
      </div>

      <div className="w-full px-[60px] flex justify-center items-center flex-1">
        <div className="w-full flex justify-between items-center h-fit">
          <div className="flex gap-2.5 items-center">
            <IoMenuSharp className="text-[30px]" />
            <span className="text-[16px] leading-[100%] tracking-[0%] font-display">
              All Categories
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex gap-2 items-center">
              <Image
                src="/home/hero/Nigeria.png"
                className="object-cover"
                alt="nigeria logo"
                width={24}
                height={24}
              />
              <span className="leading-[24px] tracking-[-0.5%] text-[16px] text-[#0E0F0C] ">
                NGN
              </span>
              <span className="text-[14px] leading-[22px] tracking-[1%] text-[#454745]">
                Naira
              </span>
            </div>
            {[
              "/home/vector icons/Vector.png",
              "/home/vector icons/Vector (1).png",
              "/home/vector icons/Vector (2).png",
            ].map((src) => {
              return (
                <Image
                  width={19}
                  height={14.5}
                  src={src}
                  alt="love icon"
                  key={src}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
