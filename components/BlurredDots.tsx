import React, { memo, useMemo } from "react";

const BlurredDots = memo(({className}:{className: string}) => {
  const dots = useMemo(
    () =>
      [...Array(28)].map((_, i) => (
        <div
          key={i}
          className={`w-[4.5px] h-[4.5px] ${className.includes("flex-col") && (i === 0 || i === 28) ? "hidden" : "flex"} bg-white/80 rounded-full`}
        />
      )),
    []
  );

  return <div className={`flex flex-nowrap gap-1.5 top-0 ${className} absolute`}>{dots}</div>;
});

export default BlurredDots;
