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
  return (
    <footer className="w-full border-t-[1px] border-gray-200 relative h-[702px] lg:hidden flex flex-col gap-[4rem] justify-end pb-10 items-center">
      <div className="w-fit h-auto bg-bue-500 -translate-x-1/2 left-[55%] top-[10%] absolute flex flex-col gap-[1.5rem] p-4">
        {footerTexts.map((text, index) => {
          return (
            <p
              key={index}
              className={`text-[12px] font-sans ${
                index === footerTexts.length - 1 || index === 4
                  ? "h-[3.5rem] flex items-end"
                  : ""
              } text-[#000000] opacity-50`}
            >
              {text}
            </p>
          );
        })}
      </div>
      <p className="mt-[9rem] text-[#828EA3] text-nowrap h-[3rem] flex">
        © 2020 - 2024 ATLAZE, Inc.
      </p>
    </footer>
  );
};

export default MobileFooter;
