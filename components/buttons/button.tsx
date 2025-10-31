import React from "react";
import { cn } from "@/lib/utils"; // <- adjust this import to your actual utils path
import { IoChevronForward } from "react-icons/io5";




interface ScifiButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | number | true;
  className?: string;
  sideIcon?:React.ReactNode
}

const ScifiButton: React.FC<ScifiButtonProps> = ({
  text = "",
  className,
  sideIcon,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        " text-black border-0 outline-0 cursor-pointer text-[16px] flex gap-2 items-center",
        className
      )}
    >
      <span className="flex gap-1 items-center">
        <span className="text-xl">{sideIcon}</span>
        {text}
      </span>
      <IoChevronForward />
    </button>
  );
};

export default ScifiButton;