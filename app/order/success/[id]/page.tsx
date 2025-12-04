import OrderSuccessClient from "./OrderSuccessClient";

interface OrderSuccessPageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  // Await in case params is a Promise (React Promise from App Router)
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    console.log("Invalid order ID: ", resolvedParams);
    return <div className="p-6 text-red-600">Invalid order ID</div>;
  }

  console.log("Order ID: ", id);

  return <OrderSuccessClient orderId={id} />;
}
