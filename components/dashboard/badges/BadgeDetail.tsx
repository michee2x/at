"use client";

import { type Badge } from "@/lib/actions/dashboard/badges";
import { getBadgeProgress } from "@/lib/utils/badge-helpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Award, TrendingUp, Target } from "lucide-react";

interface BadgeDetailProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeDetail({ badge, isOpen, onClose }: BadgeDetailProps) {
  if (!badge) return null;

  const progress = getBadgeProgress(badge);
  const isEarned = badge.acquired && badge.acquired.length > 0 && 
                   badge.acquired.some(a => a.acquired_status === 'published');
  const latestAcquired = badge.acquired?.[badge.acquired.length - 1];
  const currentLevel = badge.levels?.find(l => l.id === latestAcquired?.level_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {/* Badge Logo */}
            {badge.formatted_default_logo && (
              <div className="flex-shrink-0">
                <img 
                  src={badge.formatted_default_logo} 
                  alt={badge.badge_name}
                  className="w-20 h-20 object-contain"
                />
              </div>
            )}
            
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {badge.badge_name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                {isEarned ? (
                  <>
                    <BadgeUI variant="default" className="bg-green-100 text-green-700 border-green-300">
                      <Award className="h-3 w-3 mr-1" />
                      Earned
                    </BadgeUI>
                    {currentLevel && (
                      <BadgeUI variant="outline">
                        Level {currentLevel.level}
                      </BadgeUI>
                    )}
                  </>
                ) : (
                  <BadgeUI variant="outline" className="bg-gray-100 text-gray-700">
                    Not Earned
                  </BadgeUI>
                )}
                <span className="text-xs text-muted-foreground">
                  {badge.event?.group?.title || 'Badge'}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Description */}
        {badge.event?.description && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Description
            </h3>
            <p className="text-sm text-muted-foreground">
              {badge.event.description}
            </p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Progress Section */}
        {progress.nextLevel && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isEarned ? "Next Level Progress" : "Progress to Earn"}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Progress</span>
                <span className="font-medium">
                  {progress.current} / {progress.target}
                </span>
              </div>
              <Progress value={progress.percentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {progress.percentage.toFixed(0)}% complete
              </p>
            </div>
          </div>
        )}

        {/* Levels Section */}
        {badge.levels && badge.levels.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h3 className="font-semibold">Badge Levels</h3>
              <div className="space-y-2">
                {badge.levels.map((level) => {
                  const isCurrentLevel = currentLevel?.id === level.id;
                  const isCompleted = currentLevel && currentLevel.level >= level.level;
                  
                  return (
                    <div
                      key={level.id}
                      className={`p-3 rounded-lg border ${
                        isCurrentLevel 
                          ? 'border-primary bg-primary/5' 
                          : isCompleted 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BadgeUI 
                            variant={isCompleted ? "default" : "outline"}
                            className={isCompleted ? "bg-green-100 text-green-700" : ""}
                          >
                            Level {level.level}
                          </BadgeUI>
                          <span className="text-sm">
                            {level.level_condition} {level.level_data}
                          </span>
                        </div>
                        {level.vendor_count > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {level.vendor_count} vendors
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Earned Date */}
        {isEarned && latestAcquired?.formatted_created_at && (
          <>
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground">
              <strong>Earned on:</strong> {latestAcquired.formatted_created_at}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
