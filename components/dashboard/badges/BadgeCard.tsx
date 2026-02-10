"use client";

import { Badge } from "@/lib/actions/dashboard/badges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  progress?: {
    current: number;
    target: number;
    percentage: number;
    nextLevel: any;
  };
  onClick?: () => void;
}

export default function BadgeCard({ badge, isEarned, progress, onClick }: BadgeCardProps) {
  const latestAcquired = badge.acquired?.[badge.acquired.length - 1];
  const currentLevel = badge.levels?.find(l => l.id === latestAcquired?.level_id);
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-105",
        isEarned ? "border-primary/50 bg-primary/5" : "border-muted opacity-80"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {isEarned ? (
                <Award className="h-5 w-5 text-primary" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              {badge.badge_name}
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              {badge.event?.title || badge.event_type}
            </CardDescription>
          </div>
          
          {/* Badge Logo */}
          {badge.formatted_default_logo && (
            <div className="flex-shrink-0">
              <img 
                src={badge.formatted_default_logo} 
                alt={badge.badge_name}
                className="w-12 h-12 object-contain"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Badge Status */}
        <div className="flex items-center gap-2">
          {isEarned ? (
            <>
              <BadgeUI variant="default" className="bg-green-100 text-green-700 border-green-300">
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
        </div>

        {/* Description */}
        {badge.event?.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {badge.event.description}
          </p>
        )}

        {/* Progress Bar (for available badges or next level) */}
        {progress && progress.nextLevel && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress.current} / {progress.target}</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        )}

        {/* Earned Date */}
        {isEarned && latestAcquired?.formatted_created_at && (
          <p className="text-xs text-muted-foreground">
            Earned: {latestAcquired.formatted_created_at}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
