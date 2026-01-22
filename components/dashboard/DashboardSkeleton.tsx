import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with Balance and Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-32 bg-gray-300" /> {/* Reports title */}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-16 ml-auto bg-gray-300" /> {/* Balance label */}
            <Skeleton className="h-8 w-24 bg-gray-300" /> {/* Balance value */}
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div>
        <Skeleton className="h-4 w-20 mb-2 bg-gray-300" /> {/* Date range label */}
        <Skeleton className="h-10 w-full sm:w-80 bg-gray-300" /> {/* Date picker button */}
      </div>

      {/* Performance Section */}
      <div>
        <Skeleton className="h-7 w-32 mb-4 bg-gray-300" /> {/* Performance title */}
        
        {/* Stats Grid - 8 cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
              <Skeleton className="h-4 w-32 bg-gray-300" /> {/* Card title */}
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-8 w-20 bg-gray-300" /> {/* Value */}
                <Skeleton className="h-5 w-12 bg-gray-300" /> {/* Change % */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <Skeleton className="h-7 w-24 mb-4 bg-gray-300" /> {/* Charts title */}
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Net sales chart */}
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-6 w-24 mb-4 bg-gray-300" /> {/* Chart title */}
            <Skeleton className="h-[300px] w-full bg-gray-300" /> {/* Chart area */}
          </div>
          
          {/* Orders chart */}
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-6 w-20 mb-4 bg-gray-300" /> {/* Chart title */}
            <Skeleton className="h-[300px] w-full bg-gray-300" /> {/* Chart area */}
          </div>
        </div>
      </div>
    </div>
  );
}

