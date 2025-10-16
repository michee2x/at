import React, { memo } from "react";

const BlurredDots = memo(({ className }: { className: string }) => {
  return (
    <div className={`flex flex-nowrap gap-1.5 top-0 ${className} absolute`}>
      {[...Array(28)].map((_, i) => (
        <div key={i} className="w-[4.5px] h-[4.5px] bg-white/80 rounded-full" />
      ))}
    </div>
  );
});

BlurredDots.displayName = "BlurredDots"; // 👈 fixes ESLint react/display-name

export default BlurredDots;
