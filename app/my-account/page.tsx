// app/(root)/dashboard/page.tsx
import { ArrowRight, CreditCard, Package, Sparkles, Store, TrendingUp, User, Zap } from "lucide-react";
import { getServerSession } from "next-auth/next";

export default async function DashboardPage() {
  // Automatically uses your NextAuth route configuration
  const session = await getServerSession();

  return (
    <main>
      {/* Welcome Section */}
      <div className="mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Hello,{" "}
            <span>{session?.user ? session.user.name : <p>Dear</p>}</span>
          </h1>
          <p className="text-gray-600 mt-1">Welcome back to your dashboard</p>
        </div>
      </div>

      {/* Hero Image Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6a00f3] via-[#6a00f3] to-purple-600 rounded-3xl mb-8 sm:mb-12 shadow-2xl group">
        <div className="absolute z-10 inset-0">
          <div className="absolute z-30 top-0 right-0 size-64 lg:size-96 bg-purple-500 rounded-full -mr-32 -mt-32" />
          <div className="absolute z-30 bottom-0 left-0 size-52 lg:size-64 aspect-square bg-white/20 rounded-full -ml-24 -mb-24" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6a00f3] via-[#6a00f3] to-purple-600"></div>
        </div>
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm text-white font-medium">
                Account Dashboard
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Manage Everything
              <br />
              in One Place
            </h2>
            <p className="text-lg text-white/90 mb-8">
              View orders, manage addresses, and unlock wholesale opportunities.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-5 h-5" />
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {[
          {
            title: "Recent Orders",
            desc: "Track your purchases",
            icon: Package,
            action: "View orders",
          },
          {
            title: "Shipping & Billing",
            desc: "Manage addresses",
            icon: CreditCard,
            action: "Manage",
          },
          {
            title: "Account Details",
            desc: "Password & settings",
            icon: User,
            action: "Edit profile",
            span: "sm:col-span-2 lg:col-span-1",
          },
        ].map(({ title, desc, icon: Icon, action, span }) => (
          <a
            key={title}
            href="#"
            className={`group bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition shadow-sm hover:shadow-md ${
              span ?? ""
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              {title}
            </h3>

            <p className="text-sm text-gray-600 mb-4">{desc}</p>

            <div className="flex items-center text-gray-700 text-sm font-medium">
              {action}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>

      {/* Upgrade Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Wholesale Customer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Wholesale Customer
              </h2>
              <span className="text-sm text-blue-600 font-medium">
                Save up to 40%
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Purchase products in bulk from vendors at discounted wholesale
            prices.
          </p>

          <button
            className="w-full px-6 py-3 sm:py-4 rounded-xl font-semibold
      bg-[#6a00f3] text-white
      hover:bg-[#1800f3]
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      transition flex items-center justify-center gap-2"
          >
            Become a wholesale customer
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Vendor */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center">
              <Store className="w-8 h-8 text-purple-600" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Become a Vendor
              </h2>
              <span className="text-sm text-purple-600 font-medium">
                Start earning today
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Sell products, manage inventory, and track performance with a
            powerful vendor dashboard.
          </p>

          <button
            className="w-full px-6 py-3 sm:py-4 rounded-xl font-semibold
      bg-[#6a00f3] text-white
      hover:bg-[#1800f3]
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
      transition flex items-center justify-center gap-2"
          >
            Become a Vendor
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
