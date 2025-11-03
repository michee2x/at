"use client"

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaChevronUp } from "react-icons/fa6";
import HorizontalCategory from "./HorizontalCategory";

const AllCategoryModal = () => {
  return (
    <Link
      href={"/category"}
      className="text-[(16/1280 * 100vw)] flex-1 h-full leading-[100%] tracking-[0%] font-display"
    >
      <Tooltip>
        <TooltipTrigger className="flex h-[5rem] items-center gap-2">
          All Categories{" "}
          <FaChevronUp className="text-[16px] transform rotate-180" />
        </TooltipTrigger>

        <TooltipContent
          data-fullwidth="true"
          hideArrow
          side="bottom"
          sideOffset={-4}
          className="inset-0  flex justify-center bg-black/50 w-screen h-screen"
        >
          {/* Your white content area */}
          <div className="w-[80%] h-[80%] rounded-lg bg-white">
            <HorizontalCategory />
          </div>
        </TooltipContent>
      </Tooltip>
    </Link>
  );
}

export default AllCategoryModal