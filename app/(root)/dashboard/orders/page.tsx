// app/orders/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { WooClient } from "@/lib/wooClient";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) return redirect("/login");

  const wpToken = (session as any).wpToken as string | undefined;
  if (!wpToken) {
    // if no WP token present, user might be logged into NextAuth but WP JWT not attached
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p>No WooCommerce token available. Please log out and log in again.</p>
      </div>
    );
  }

  let orders: any[] = [];
  try {
    orders = await WooClient.getOrdersForUser(wpToken);
  } catch (err: any) {
    console.error("Orders fetch error", err);
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-red-500">Failed to fetch orders: {err.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your orders</h1>
      {orders.length === 0 && <p>No orders found.</p>}
      <ul className="space-y-4">
        {orders.map((o: any) => (
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
