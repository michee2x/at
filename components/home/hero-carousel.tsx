import React from "react";
import Link from "next/link";
import Image from "next/image";

const HeroCarousel = () => {
  const images = [
    {
      src: "/home/hero/27e49ba5c91c1af8960a1ac7dcc2d147692bfa96 (1).jpg",
      y: 4.5,
      link: "/categories/?cat=76&title=Revamp your home in style",
    },
    { 
      src: "/home/hero/Frame%201000003698.png", 
      y: 2.5,
      link: "/categories/?cat=75&title=Great Sound and Headphones" 
    },
    { 
      src: "/home/hero/Frame%201000003699.png", 
      y: 0,
      link: "/categories/?cat=80&title=Styles for Women" 
    },
    { 
      src: "/home/hero/Frame%201000003700.png", 
      y: 0,
      link: "/categories/?cat=77&title=Appliances" 
    },
    { 
      src: "/home/hero/Frame%201000003703.png", 
      y: 2.5,
      link: "/categories/?cat=81&title=Home Accessories" 
    },
    {
      src: "/home/hero/da264833a58db801ba764ae613cfba43c5dc08f3%20(1).jpg",
      y: 4.5,
      link: "/categories/?cat=78&title=Accessories"
    },
  ];

  return (
    <div
      style={{ transformStyle: "preserve-3d" }}
      className="w-full mt-16 lg:mt-40 h-auto flex justify-center"
    >
      <ul
        style={{ transformStyle: "preserve-3d" }}
        className="list-none hidden grid-cols-2 sm:flex w-full gap-2 sm:w-fit h-fit"
      >
        {images.map((img, idx) => {
          return (
            <div key={`${img.src}-${idx}`}>
              <li
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translate3d(0px, calc(${img.y * -50}px/1440px*100vw), 0px)`,
                }}
                className="relative rounded-[24px] overflow-hidden h-[calc(450/1440*100vw)] w-[calc(300/1440*100vw)] group cursor-pointer"
              >
                <Link href={img.link} className="block w-full h-full relative">
                  <Image
                    style={{ transformStyle: "preserve-3d" }}
                    src={img.src}
                    className="object-cover object-right transition-transform duration-500 ease-out group-hover:scale-110"
                    fill
                    alt={img.src}
                  />
                </Link>
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
          images[1],
          images[2],
          images[0],
          images[5]
        ].map((img, idx) => {
          return (
            <div key={`${img.src}-${idx}`}>
              <Link href={img.link} className="block w-full h-full relative group">
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
                    className="object-cover object-right transition-transform duration-500 ease-out group-hover:scale-110"
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
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                    fill
                    alt={img.src}
                  />
                </li>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default HeroCarousel;
