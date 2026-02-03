"use client";

import { useState } from "react";
import { followStore, unfollowStore } from "@/lib/actions/store/follow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowStoreButtonProps {
  storeId: number;
  initialIsFollowing?: boolean;
  storeName: string;
  className?: string;
}

export function FollowStoreButton({ 
  storeId, 
  initialIsFollowing = false, 
  storeName,
  className 
}: FollowStoreButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        const result = await unfollowStore(storeId);
        if (result.success) {
          setIsFollowing(false);
          toast.success(`Unfollowed ${storeName}`);
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await followStore(storeId);
        if (result.success) {
          setIsFollowing(true);
          toast.success(`Following ${storeName}`);
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={cn("gap-2", className)}
      onClick={handleToggleFollow}
      disabled={isLoading}
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
