// Custom Skeleton component to ensure visibility
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
}

export default function Loading() {
  return (
    <div className="container w-full mx-auto md:max-w-[95%] lg:max-w-full xl:max-w-[1300px] 2xl:max-w-[1440px] px-2 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 mb-8 items-center">
        <Skeleton className="h-4 w-16" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-4 w-24" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Product Images Skeleton */}
        <div className="w-full lg:w-[60%] space-y-4">
           {/* Main Image */}
           <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden lg:flex flex-col gap-4 w-24 shrink-0">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-full aspect-square rounded-xl" />
                  ))}
              </div>
              {/* Main View */}
              <Skeleton className="flex-1 aspect-square lg:aspect-[4/3] rounded-2xl" />
           </div>
        </div>

        {/* Right: Product Info Skeleton */}
        <div className="flex-1 px-2 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 max-w-md" /> {/* Title */}
            <Skeleton className="h-4 w-24" /> {/* Category */}
            
            <div className="flex items-center gap-1">
               <Skeleton className="h-4 w-24" /> {/* Rating */}
            </div>

            <Skeleton className="h-8 w-32 mt-4" /> {/* Price */}
          </div>

          <div className="h-px bg-gray-100" />

          {/* Short Description */}
          <div className="space-y-2">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-[80%]" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <Skeleton className="h-12 w-full rounded-full" />
             <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Description Tabs Skeleton */}
      <div className="mt-16 space-y-6">
         <div className="flex gap-8 border-b pb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
         </div>
         <div className="space-y-3 max-w-3xl">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
         </div>
      </div>
    </div>
  );
}
