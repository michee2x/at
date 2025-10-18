import React from "react";
import Image from "next/image";

const HeroCarousel = () => {
  return (
    <div
      style={{ transformStyle: "preserve-3d" }}
      className="w-full mt-16 lg:mt-40 h-auto flex justify-center"
    >
      <ul
        style={{ transformStyle: "preserve-3d" }}
        className="list-none hidden grid-cols-2 sm:flex w-full gap-2 sm:w-fit h-fit"
      >
        {[
          {
            src: "/home/hero/27e49ba5c91c1af8960a1ac7dcc2d147692bfa96 (1).jpg",
            y: 4.5,
          },
          { src: "/home/hero/Frame%201000003698.png", y: 2.5 },
          { src: "/home/hero/Frame%201000003699.png", y: 0 },
          { src: "/home/hero/Frame%201000003700.png", y: 0 },
          { src: "/home/hero/Frame%201000003703.png", y: 2.5 },
          {
            src: "/home/hero/da264833a58db801ba764ae613cfba43c5dc08f3%20(1).jpg",
            y: 4.5,
          },
        ].map((img, idx) => {
          return (
            <div key={`${img.src}-${idx}`}>
              <li
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translate3d(0px, calc(${img.y * -50}px/1440px*100vw), 0px)`,
                }}
                className="relative rounded-[24px] overflow-hidden h-[calc(450/1440*100vw)] w-[calc(300/1440*100vw)]"
              >
                <Image
                  style={{ transformStyle: "preserve-3d" }}
                  src={img.src}
                  className="object-cover object-right"
                  fill
                  alt={img.src}
                />
              </li>
            </div>
          );
        })}
      </ul>

      <ul
        style={{ transformStyle: "preserve-3d" }}
        className="list-none grid sm:hidden grid-cols-2 w-full gap-2 lg:w-fit h-fit"
      >
        {[
          { src: "/home/hero/Frame%201000003698.png", y: 2.5 },
          { src: "/home/hero/Frame%201000003699.png", y: 0 },
          {
            src: "/home/hero/27e49ba5c91c1af8960a1ac7dcc2d147692bfa96 (1).jpg",
            y: 4.5,
          },
          {
            src: "/home/hero/da264833a58db801ba764ae613cfba43c5dc08f3%20(1).jpg",
            y: 4.5,
          },
        ].map((img, idx) => {
          return (
            <div key={`${img.src}-${idx}`}>
              <li
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translate3d(0px, ${img.y * -50}px, 0px)`,
                }}
                className={`relative hidden lg:flex rounded-[24px] overflow-hidden min-w-[300px] min-h-[450px]`}
              >
                <Image
                  style={{ transformStyle: "preserve-3d" }}
                  src={img.src}
                  className="object-cover object-right"
                  fill
                  alt={img.src}
                />
              </li>

              <li
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative lg:hidden rounded-[24px] overflow-hidden w-full min-h-[240px]"
              >
                <Image
                  style={{ transformStyle: "preserve-3d" }}
                  src={img.src}
                  className="object-cover object-center"
                  fill
                  alt={img.src}
                />
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default HeroCarousel;
