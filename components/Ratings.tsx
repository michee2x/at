"use client"

export function Ratings({ rating = 0 }: { rating?: number }) {
  // Clamp the rating to a safe range (0–5)
  const safeRating = Math.max(0, Math.min(5, rating));

  // DaisyUI has 10 inputs (5 stars × 2 halves)
  // Each half star = 0.5
  const totalHalves = Math.round(safeRating * 2); // e.g. 4.5 → 9

  return (
    <div className="rating rating-xs lg:rating-sm rating-half">
      <input type="radio" name={`rating-${rating}`} className="rating-hidden" />

      {Array.from({ length: 10 }).map((_, i) => {
        const value = (i + 1) / 2; // half-star values: 0.5, 1, 1.5, 2, ...
        const isChecked = value === safeRating;

        return (
          <input
            key={i}
            type="radio"
            name={`rating-${rating}`}
            className={`mask mt-[1px] mask-star-2 ${
              i % 2 === 0 ? "mask-half-1" : "mask-half-2"
            } bg-[#6A00EF]`}
            aria-label={`${value} star`}
            defaultChecked={isChecked || totalHalves === i + 1}
            readOnly
          />
        );
      })}
    </div>
  );
}