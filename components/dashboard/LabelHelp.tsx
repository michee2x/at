"use client";

import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LabelHelpProps {
  children: React.ReactNode;
  className?: string;
}

export function LabelHelp({ children }: LabelHelpProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 ml-1.5 inline-block text-muted-foreground cursor-help align-text-bottom" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px]">
        <p className="font-normal">{children}</p>
      </TooltipContent>
    </Tooltip>
  );
}
