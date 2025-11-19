// app/(root)/dashboard/orders/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { WooClient } from "@/lib/wooClient";

type WooOrder = {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) return redirect("/login");

  // Instead of using any, we type-guard the session object
  const wpToken =
    typeof session === "object" &&
    session !== null &&
    "wpToken" in session &&
    typeof (session as { wpToken?: string }).wpToken === "string"
      ? (session as { wpToken: string }).wpToken
      : undefined;

  if (!wpToken) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p>No WooCommerce token available. Please log out and log in again.</p>
      </div>
    );
  }

  let orders: WooOrder[] = [];

  try {
    const result = await WooClient.getOrdersForUser(wpToken);

    // Ensure the response is typed correctly
    if (Array.isArray(result)) {
      orders = result as WooOrder[];
    } else {
      orders = [];
    }
  } catch (err) {
    console.error("Orders fetch error", err);

    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch orders";

    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your orders</h1>

      {orders.length === 0 && <p>No orders found.</p>}

      <ul className="space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="p-4 border rounded bg-neutral-800">
            <div className="flex justify-between">
              <strong>Order #{o.id}</strong>
              <span>{o.status}</span>
            </div>

            <div className="text-sm">
              Total: {o.total} {o.currency}
            </div>

            <div className="text-sm">Created: {o.date_created}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
