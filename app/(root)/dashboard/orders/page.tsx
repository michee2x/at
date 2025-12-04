// app/orders/page.tsx
import { User } from "@/lib/user/User";
import { getUserOrdersAction } from "@/lib/actions/UserAction";
import { WooOrder } from "@/lib/user/types";
import { toNumber } from "@/utils/to-number";
import OrderCard from "@/components/OrderCard";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { getServerSessionFromAPI } from "@/utils/getServerSessionFromAPI";


export default async function OrdersPage() {
  const session = await getServerSessionFromAPI();

  if (!session?.user) {
    return <div className="p-6 text-red-600">You are not signed in</div>;
  }

  console.log("this is the session user: ", session);

  const customerId = toNumber(session.user.id);

  let orders: WooOrder[] = [];

  try {
    orders = await getUserOrdersAction(customerId);
  } catch (err) {
    console.error(err);
    return (
      <div className="p-6 text-red-600">
        Failed to load orders. Please try again later.
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="p-6">You have no orders yet.</div>;
  }

  console.log("these are the orders: ", orders);

  return (
    <div className="container px-4 mx-auto pt-6 lg:px-6">
      <AnimatedTooltipPreview orders={orders} />
    </div>
  );
}

export function AnimatedTooltipPreview({ orders }: { orders: WooOrder[] }) {
  return (
    <div className="mb-10 font-poppins px-4 w-full">
      <div className="w-full py-4 lg:px-8 mt-4 mb-2 h-auto flex flex-col lg:flex-row justify-between">
        <span className="text-[#343A40] text-[14px] lg:text-[21px] font-[SF Pro Display] font-[500]">
          Your orders for this month
        </span>
        <span className="text-[#ED473D] text-[14px] lg:text-[16px] font-[SF Pro Display] font-[500]">
          <span></span>
          <span>Live Order Tracking (1)</span>
        </span>
      </div>
      <div className="min-w-full lg:p-4 grid-cols-1 lg:grid-cols-3 grid gap-10 h-auto">
        {orders.map((order, idx) => (
          <OrderCard key={idx} order={order} />
        ))}
      </div>
    </div>
  );
}
