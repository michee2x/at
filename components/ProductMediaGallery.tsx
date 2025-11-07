"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";

// --------------------
// Types
// --------------------
type WooImage = {
  id: number;
  src: string;
  thumbnail?: string;
  alt?: string;
};

type MetaDatum = {
  id?: number;
  key: string;
  value: string | number | boolean | null;
};

type WooProduct = {
  id: number;
  name: string;
  images: WooImage[];
  meta_data?: MetaDatum[];
};

type MediaItem =
  | {
      id: string;
      type: "image";
      src: string;
      thumb?: string;
      alt?: string;
    }
  | {
      id: string;
      type: "video";
      src: string;
      thumb?: string;
      provider?: "youtube" | "other";
    };

type Props = {
  product: WooProduct;
  className?: string;
};

export default function ProductMediaGallery({
  product,
  className = "",
}: Props) {
  // --- Hooks (must be declared first!)
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const mainRef = useRef<HTMLDivElement | null>(null);

  // --- Meta data ---
  const meta = useMemo(() => product.meta_data ?? [], [product.meta_data]);

  // --- Extract videos ---
  const videosFromMeta = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];
    for (let i = 1; i <= 10; i++) {
      const urlMeta = meta.find((m) => m.key === `_product_video_url_${i}`);
      if (!urlMeta?.value || typeof urlMeta.value !== "string") continue;
      const thumbMeta = meta.find((m) => m.key === `_product_video_thumb_${i}`);
      const isYouTube = /youtube\.com|youtu\.be/.test(urlMeta.value);
      items.push({
        id: `video-${i}`,
        type: "video",
        src: urlMeta.value,
        thumb:
          typeof thumbMeta?.value === "string" ? thumbMeta.value : undefined,
        provider: isYouTube ? "youtube" : "other",
      });
    }
    return items;
  }, [meta]);

  // --- Extract images ---
  const imagesFromProduct = useMemo<MediaItem[]>(() => {
    return (product.images || []).map((img, idx) => ({
      id: `img-${img.id ?? idx}`,
      type: "image" as const,
      src: img.src,
      thumb: img.thumbnail ?? img.src,
      alt: img.alt ?? product.name ?? "product image",
    }));
  }, [product.images, product.name]);

  // --- Combine order ---
  const mediaList = useMemo(() => {
    const posMeta = meta.find((m) => m.key === "_product_video_position");
    const pos = (
      typeof posMeta?.value === "string" ? posMeta.value : "first"
    ).toLowerCase();
    return pos === "first"
      ? [...videosFromMeta, ...imagesFromProduct]
      : [...imagesFromProduct, ...videosFromMeta];
  }, [videosFromMeta, imagesFromProduct, meta]);

  // --- Preload ---
  useEffect(() => {
    mediaList.forEach((m) => {
      if (m.type === "image" || m.thumb) {
        const img = new window.Image();
        img.src = m.thumb ?? m.src;
      } else if (m.type === "video" && !/youtube/.test(m.src)) {
        const video = document.createElement("video");
        video.src = m.src;
        video.preload = "auto";
      }
    });
  }, [mediaList]);

  // --- Early return AFTER hooks ---
  if (!mediaList.length) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gray-100 w-full h-80 flex items-center justify-center">
          <span className="text-sm text-gray-500">No media available</span>
        </div>
      </div>
    );
  }

  // --- Handlers ---
  const prev = () => {
    setPrevActive(active);
    setDirection("left");
    setActive((s) => (s - 1 + mediaList.length) % mediaList.length);
  };

  const next = () => {
    setPrevActive(active);
    setDirection("right");
    setActive((s) => (s + 1) % mediaList.length);
  };

  // --- Helpers ---
  const youtubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    const id = match?.[1];
    return id ? `https://www.youtube.com/embed/${id}?rel=0&playsinline=1` : url;
  };

  // --- Render Main ---
  const renderMain = (item: MediaItem) => {
    if (item.type === "image") {
      return (
        <NextImage
          src={item.src}
          alt={item.alt ?? product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      );
    }

    const isYouTube = item.provider === "youtube";
    if (isYouTube) {
      const embed = youtubeEmbedUrl(item.src);
      return (
        <iframe
          title={`video-${item.id}`}
          src={embed}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      );
    }

    return /\.(mp4|webm|ogg)$/i.test(item.src) ? (
      <video
        src={item.src}
        controls
        playsInline
        preload="auto"
        poster={item.thumb}
        className="w-full h-full object-contain bg-black"
      />
    ) : (
      <NextImage
        src={item.thumb ?? "/placeholder.jpg"}
        alt="video"
        fill
        className="object-contain"
      />
    );
  };

  // --- JSX ---
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row gap-4 w-full items-center sm:items-start ${className}`}
    >
      {/* Thumbnails */}
      <div className="flex h-full sm:flex-col gap-3 w-full sm:w-24 overflow-x-auto sm:overflow-y-auto sm:max-h-[490px] scrollbar-thin scrollbar-thumb-gray-300">
        {mediaList.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => {
              if (idx === active) return;
              setPrevActive(active);
              setDirection(idx > active ? "right" : "left");
              setActive(idx);
            }}
            className={`flex-shrink-0 w-20 h-20 sm:w-16 sm:h-16 rounded-md overflow-hidden border ${
              idx === active
                ? "ring-2 ring-indigo-500"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            {m.type === "image" ? (
              <NextImage
                src={m.thumb ?? m.src}
                alt={m.alt ?? ""}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="relative w-full h-full">
                <NextImage
                  src={m.thumb ?? "/placeholder.jpg"}
                  alt="video thumb"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7-11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Viewer */}
      <div
        ref={mainRef}
        className="relative w-full sm:flex-1 h-[400px] sm:h-[480px] bg-white rounded-lg overflow-hidden shadow-sm"
      >
        {/* Navigation */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="rotate-180"
          >
            <path d="M7 17l7-5-7-5v10z" fill="currentColor" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M7 17l7-5-7-5v10z" fill="currentColor" />
          </svg>
        </button>

        {/* Media Render */}
        <div className="relative w-full h-full overflow-hidden">
          {mediaList.map((m, idx) => {
            const isCurrent = idx === active;
            const isPrev = idx === prevActive;
            if (!isCurrent && !isPrev) return null;

            return (
              <div
                key={m.id}
                className="absolute inset-0 transition-transform duration-500 ease-in-out"
                style={{
                  transform:
                    isCurrent && prevActive !== null
                      ? "translateX(0)"
                      : isPrev
                      ? direction === "right"
                        ? "translateX(-100%)"
                        : "translateX(100%)"
                      : "translateX(100%)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center bg-white">
                  {renderMain(m)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
