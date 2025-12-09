"use client";

interface RatingsProps {
  rating?: number;
  starSize?: number; // in px
}

export function Ratings({ rating = 0, starSize = 12 }: RatingsProps) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating % 1 >= 0.5 ? 1 : 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-[2px]">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg
            key={`full-${i}`}
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill="#6A00EF"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.78 1.4 8.163L12 18.896l-7.334 3.857 1.4-8.163L.132 9.21l8.2-1.192z" />
          </svg>
        ))}

        {/* Half star */}
        {halfStar === 1 && (
          <svg width={starSize} height={starSize} viewBox="0 0 24 24">
            <defs>
              <linearGradient id="halfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#6A00EF" />
                <stop offset="50%" stopColor="#E0E0E0" />
              </linearGradient>
            </defs>
            <path
              d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.78 1.4 8.163L12 18.896l-7.334 3.857 1.4-8.163L.132 9.21l8.2-1.192z"
              fill="url(#halfGrad)"
            />
          </svg>
        )}

        {/* Empty stars */}
        {Array.from({ length: 5 - fullStars - halfStar }).map((_, i) => (
          <svg
            key={`empty-${i}`}
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill="#E0E0E0"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.78 1.4 8.163L12 18.896l-7.334 3.857 1.4-8.163L.132 9.21l8.2-1.192z" />
          </svg>
        ))}
      </div>

      {/* Rating text */}
      <span className="text-[10px] lg:text-[12px] text-black/50">
        ({rating})
      </span>
    </div>
  );
}
