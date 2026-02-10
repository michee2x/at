"use client";

import { Badge, getBadgeProgress } from "@/lib/actions/dashboard/badges";
import BadgeCard from "./BadgeCard";

interface BadgeGridProps {
  badges: Badge[];
  isEarned: boolean;
  onBadgeClick: (badge: Badge) => void;
}

export default function BadgeGrid({ badges, isEarned, onBadgeClick }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{isEarned ? "No badges earned yet." : "No available badges to earn."}</p>
        <p className="text-sm mt-2">
          {isEarned 
            ? "Keep working to earn your first badge!" 
            : "Check back later for new badge opportunities."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => {
        const progress = getBadgeProgress(badge);
        
        return (
          <BadgeCard
            key={badge.badge_id}
            badge={badge}
            isEarned={isEarned}
            progress={progress}
            onClick={() => onBadgeClick(badge)}
          />
        );
      })}
    </div>
  );
}
