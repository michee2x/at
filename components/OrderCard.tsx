import { WooOrder } from "@/lib/user/types";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { ClockArrowDown, ClockCheck, Plus } from "lucide-react";
import Link from "next/link";

const OrderCard = ({ order }: { order: WooOrder | null }) => {
    if(!order) {
        return null;
    }
  const lineItems = (order: WooOrder) => {
    return order.line_items.slice(0, 5).map((item) => ({
      ...item,
      image: item.image?.src,
    }));
  };
  return (
    <div className="lg:w-full w-full lg:p-3 h-[228.32px]">
      <div className="w-full flex flex-col gap-2">
        <div className="flex-1 flex items-center">
          <AnimatedTooltip items={lineItems(order)} />
          {order.line_items.length - 2 > 0 && (
            <span className="relative cursor-pointer bg-gray-200 ml-6 h-14 w-14 rounded-full border-2 border-white object-cover object-top transition duration-500 hover:z-30 hover:scale-105">
              <span className="absolute inset-0 flex items-center justify-center rounded-full">
                <Plus />
                <span className="text-xl">{order.line_items.length - 2}</span>
              </span>
            </span>
          )}
        </div>
        {order.status === "pending" && (
          <Link
            href={`/order/success/${order.id}`}
            className="relative w-fit cursor-pointer text-[#F7B232] h-auto rounded-full border-2 border-white object-cover flex gap-1 items-center text-[16px] transition duration-500 hover:z-30 hover:scale-105"
          >
            <ClockArrowDown />
            <span>pending</span>
          </Link>
        )}
        {order.status === "processing" && (
          <span className="relative w-fit cursor-pointer text-[#3ce212] h-auto rounded-full border-2 border-white object-cover flex gap-1 items-center text-[16px] transition duration-500 hover:z-30 hover:scale-105">
            <ClockCheck />
            <span>processing</span>
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="lg:text-[17.96px] text-[16.63px] text-[#343A40] font-[500]">
          {order.order_key?.replace("wc_order_", "")}
        </p>
        <p className="text:text-[15.39px] text-[14.25px] font-[500] text-[#6C757D] font-[SF Pro Display]">
          Delivery code
        </p>
      </div>

      <div className="w-full mt-5 h-auto flex justify-between">
        <span className="text-[#6C757D] text-[12.1px] lg:text-[13.06px] font-[SF Pro Display] font-[500]">
          Total amount
        </span>
        <span className="text-[#6C757D] text-[12.1px] lg:text-[13.06px] font-[SF Pro Display] font-[500]">
          Delivery Address
        </span>
      </div>

      <div className="w-full mt-2 h-auto flex justify-between">
        <span className="text-[#343A40] text-[14.12px] lg:text-[15.24px] font-[500] font-[SF Pro Display]">
          #{order.total}
        </span>
        <span className="text-[#343A40] flex justify-end w-fit text-[14.12px] lg:text-[15.24px] font-[500] font-[SF Pro Display]">
          {order?.billing.address_2.length > 26 ? `${order?.billing.address_2.slice(0, 26)}...` : order?.billing.address_2 ? order?.billing.address_2 :
            "N/A"}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
