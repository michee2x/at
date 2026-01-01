"use client";

import { usePathname } from "next/navigation";
import React from "react";
const footerTexts: string[] = [
  "Company",
  "How it Works",
  "Careers",
  "Blog",
  "Resources",
  "Android Reviews",
  "iOS Reviews",
  "Testimonials.to",
  "Legal",
];

const MobileFooter: React.FC = () => {
  const pathname = usePathname();
  const pages = ["category"] as const;

  const status = Object.fromEntries(
    pages.map((page) => [page, pathname?.includes(page)])
  );

  // Usage:
  const { category } = status;
  return (
    <footer
      className={`w-full font-poppins ${
        category ? "hidden" : "flex"
      } lg:hidden flex-col gap-4 justify-center items-center bg-white border-t-[1px] border-gray-200 p-4`}
    >
      <div className="w-full max-w-xs mx-auto flex flex-col gap-4 p-2">
        {footerTexts.map((text, index) => {
          return (
            <p
              key={index}
              className={`text-[13px] ${
                index === footerTexts.length - 1 || index === 4
                  ? "h-[3.5rem] flex items-end"
                  : ""
              } font-display text-black opacity-90`}
            >
              {text}
            </p>
          );
        })}
      </div>
      <p className="text-[#828EA3] text-nowrap h-[3rem] flex">
        © 2020 - {new Date().getFullYear()} ATLASE, Inc.
      </p>
    </footer>
  );
};

export default MobileFooter;
