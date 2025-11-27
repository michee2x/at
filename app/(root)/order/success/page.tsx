import OrderSuccessfull from "@/components/lottie/OrderSuccessfull";
import Link from "next/link";

export default function OrderSuccess() {

  return (
    <div className="container h-screen mx-auto p-8 text-center">
      <div className="w-40 h-40 mx-auto mb-8">
        <OrderSuccessfull />
      </div>
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p>Your order has been successfully placed.</p>
      <div className="flex mt-5 gap-4">
        <Link href="/dashboard">
          <button type="submit" className="btn">
            Go to Dashboard
          </button>
        </Link>
        <Link href="/dashboard/orders">
          <button type="submit" className="btn">
            View Orders
          </button>
        </Link>
      </div>
    </div>
  );
}
