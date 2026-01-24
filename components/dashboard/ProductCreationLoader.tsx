"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type LoadingStage = "idle" | "uploading" | "creating" | "success" | "redirecting";

interface ProductCreationLoaderProps {
  stage: LoadingStage;
  progress: number; // 0 to 100
  title?: string;
}

const TIPS = [
  "Did you know? High-quality images can increase sales by up to 30%.",
  "Pro Tip: Use detailed descriptions to help customers find your products.",
  "Adding categories helps your product appear in relevant searches.",
  "Inventory management is key to preventing overselling.",
  "Use tags to improve your product's visibility in search results.",
];

export function ProductCreationLoader({ stage, progress, title }: ProductCreationLoaderProps) {
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (stage === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        
        {/* Animated Icon/State */}
        <div className="flex justify-center mb-8">
            <AnimatePresence mode="wait">
                {stage === "success" || stage === "redirecting" ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center"
                    >
                        <Check className="h-10 w-10 text-green-600" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="loading"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="h-20 w-20 bg-[#6a00f3]/10 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="h-10 w-10 text-[#6a00f3]" />
                        </div>
                        {/* Orbiting Loader */}
                        <div className="absolute inset-0 border-4 border-[#6a00f3]/30 border-t-[#6a00f3] rounded-full animate-spin"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Main Title */}
        <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {stage === "uploading" && "Uploading Assets"}
                {stage === "creating" && "Finalizing Product"}
                {(stage === "success" || stage === "redirecting") && "Product Created!"}
            </h2>
            <p className="text-muted-foreground font-medium">
                {title || (stage === "uploading" ? "Please wait while we process your media..." : "Almost there...")}
            </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-100" indicatorClassName="bg-[#6a00f3]" />
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>{Math.round(progress)}% Complete</span>
                <span>{stage === "uploading" ? "Step 1/2" : (stage === "success" ? "Done" : "Step 2/2")}</span>
            </div>
        </div>

        {/* Rotating Tips */}
        <AnimatePresence mode="wait">
            <motion.div
                key={tipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-8 max-w-xs mx-auto"
            >
                <div className="flex items-center justify-center gap-2 mb-2 text-[#6a00f3] text-sm font-semibold uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    Did you know?
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{TIPS[tipIndex]}"
                </p>
            </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
