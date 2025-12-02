import { WooOrder } from "@/lib/user/types";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";

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
      <div className="w-full flex ">
        <AnimatedTooltip items={lineItems(order)} />
        <span className="relative bg-gray-200 !m-0 h-14 lg:h-16 w-14 lg:w-16 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105">
          <span className="absolute inset-0 flex items-center justify-center rounded-full">
            +6
          </span>
        </span>
      </div>

      <div className="mt-4">
        <p className="lg:text-[17.96px] text-[16.63px] text-[#343A40] font-[500]">
          {order.order_key}
        </p>
        <p className="text:text-[15.39px] text-[14.25px] font-[500] text-[#6C757D] font-[SF Pro Display]">
          Delivery code
        </p>
      </div>

      <div className="w-full mt-10 h-auto flex justify-between">
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
        <span className="text-[#343A40] text-[14.12px] lg:text-[15.24px] font-[500] font-[SF Pro Display]">
          {order?.billing.address_2}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
