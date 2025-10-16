import React, { memo } from "react";

const BlurredDots = memo(({ className }: { className: string }) => {
  return (
    <div className={`flex flex-nowrap gap-1.5 top-0 ${className} absolute`}>
      {[...Array(28)].map((x, i) => (
        <div
          key={`${i}${x}`}
          className={`w-[4.5px] h-[4.5px] bg-white/80 rounded-full`}
        />
      ))}
    </div>
  );
});

export default BlurredDots;
