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
        className="list-none hidden grid-cols-2 lg:flex w-full gap-2 lg:w-fit h-fit"
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
        ].map((img) => {
          return (
            <>
              <li
                key={img.src}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translate3d(0px, ${img.y * -50}px, 0px)`,
                }}
                className="relative hidden lg:flex rounded-[24px] overflow-hidden min-w-[300px] min-h-[450px]"
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
                key={`${img.src}-mobile`}
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
            </>
          );
        })}
      </ul>

      <ul
        style={{ transformStyle: "preserve-3d" }}
        className="list-none grid lg:hidden grid-cols-2 w-full gap-2 lg:w-fit h-fit"
      >
        {[
          { src: "/home/hero/Frame%201000003698.png", y: 2.5},
          { src: "/home/hero/Frame%201000003699.png", y: 0},
          {
            src: "/home/hero/27e49ba5c91c1af8960a1ac7dcc2d147692bfa96 (1).jpg",
            y: 4.5
          },
          {
            src: "/home/hero/da264833a58db801ba764ae613cfba43c5dc08f3%20(1).jpg",
            y: 4.5
          },
        ].map((img, idx) => {
          return (
            <>
              <li
                key={img.src}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translate3d(0px, ${img.y * -50}px, 0px)`,
                  order: idx === 2 ? 1 : "unset",
                }}
                className={`relative hidden ${
                  idx === 2 ? "order-1" : ""
                } lg:flex rounded-[24px] overflow-hidden min-w-[300px] min-h-[450px]`}
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
                key={`${img.src}-mobile`}
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
            </>
          );
        })}
      </ul>
    </div>
  );
}

export default HeroCarousel