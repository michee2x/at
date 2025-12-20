import { Suspense } from "react";
import { getOrders } from "@/lib/actions/dashboard/orders";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import OrderCard from "@/components/OrderCard";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";

const OrderCardSkeleton = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AtlazeLoader />
    </div>
  );
};

export const metadata = {
  title: "Orders | Dashboard",
  description: "View and manage your orders",
};

async function OrdersList() {
  const { orders } = await getOrders(1, 10);
  console.log("this is the res from ordres: ", orders)

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-w-full lg:p-4 grid-cols-1 lg:grid-cols-3 grid gap-10 h-auto">
      {orders.length > 0 ? (
        orders.map((order, idx) => <OrderCard key={idx} order={order} />)
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          no orders made
        </div>
      )}
    </div>
  );
}

export default async function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your order history
        </p>
      </div>

      <Suspense fallback={<OrderCardSkeleton />}>
        <OrdersList />
      </Suspense>
    </div>
  );
}
