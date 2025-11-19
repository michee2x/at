import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage({}) {
  const session = await getServerSession(authOptions);

  // redirect if no session
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>

      {/* Example e-commerce dashboard content */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Orders</h2>
        <p>List your recent orders here...</p>
      </div>
    </div>
  );
}
