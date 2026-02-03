import { Suspense } from "react";
import { getStoreFollowers } from "@/lib/actions/dashboard/followers";
import { FollowersTable } from "@/components/dashboard/followers/FollowersTable";
import { Skeleton } from "@/components/ui/skeleton";

export default async function FollowersPage() {
  const followers = await getStoreFollowers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Followers</h1>
        <p className="text-muted-foreground mt-2">
          View and engage with your store followers.
        </p>
      </div>

      <Suspense fallback={<FollowersSkeleton />}>
        <FollowersTable followers={followers} />
      </Suspense>
    </div>
  );
}

function FollowersSkeleton() {
  return (
    <div className="rounded-md border bg-card">
      <div className="border-b px-4 py-3">
         <Skeleton className="h-4 w-24" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
             <Skeleton className="h-10 w-10 rounded-full" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
