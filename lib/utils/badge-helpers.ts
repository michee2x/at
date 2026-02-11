import type { Badge, BadgeLevel, BadgeAcquired } from "@/lib/actions/dashboard/badges";

// Helper function to separate earned vs available badges
export function categorizeBadges(badges: Badge[]) {
  const earned: Badge[] = [];
  const available: Badge[] = [];

  badges.forEach(badge => {
    // Check if vendor has acquired any level of this badge
    const hasAcquired = badge.acquired && badge.acquired.length > 0 && 
                       badge.acquired.some(a => a.acquired_status === 'published');
    
    if (hasAcquired) {
      earned.push(badge);
    } else {
      available.push(badge);
    }
  });

  return { earned, available };
}

// Helper to get badge progress
export function getBadgeProgress(badge: Badge): {
  current: number;
  target: number;
  percentage: number;
  nextLevel: BadgeLevel | null;
} {
  if (!badge.acquired || badge.acquired.length === 0) {
    const firstLevel = badge.levels?.[0];
    return {
      current: 0,
      target: firstLevel ? parseInt(firstLevel.level_data) : 0,
      percentage: 0,
      nextLevel: firstLevel || null,
    };
  }

  const latestAcquired = badge.acquired[badge.acquired.length - 1];
  const currentLevel = badge.levels?.find(l => l.id === latestAcquired.level_id);
  const currentValue = parseInt(latestAcquired.acquired_data) || 0;
  
  // Find next level
  const currentLevelNum = currentLevel?.level || 0;
  const nextLevel = badge.levels?.find(l => l.level === currentLevelNum + 1) || null;
  
  const targetValue = nextLevel ? parseInt(nextLevel.level_data) : currentValue;
  const percentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 100;

  return {
    current: currentValue,
    target: targetValue,
    percentage,
    nextLevel,
  };
}
