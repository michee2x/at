"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { WooProductReview } from "@/types";
import { submitReviewAction } from "@/lib/actions/review-actions";
import { FiStar } from "react-icons/fi";

// Zod Schema
const reviewSchema = z.object({
  reviewer: z.string().min(2, "Name is required"),
  reviewer_email: z.string().email("Invalid email address"),
  rating: z.number().min(1, "Please select a rating").max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: number;
  productSlug?: string;
  onSuccess: (review: WooProductReview) => void;
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

export function ReviewForm({ productId, productSlug, onSuccess, user }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      reviewer: user?.name || "",
      reviewer_email: user?.email || "",
      review: "",
    },
  });

  const rating = watch("rating");

  const onSubmit = (data: ReviewFormValues) => {
    startTransition(async () => {
      try {
        const newReview = await submitReviewAction({
          ...data,
          product_id: productId,
          productSlug,
        });
        
        toast.success("Review submitted successfully!");
        reset({
           rating: 0,
           review: "",
           reviewer: user?.name || "",
           reviewer_email: user?.email || ""
        });
        onSuccess(newReview);
      } catch (error) {
        console.error(error);
        toast.error("Failed to submit review. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-6 rounded-2xl font-poppins text-sm md:text-base">
      <h3 className="text-lg font-bold mb-4 font-display text-gray-900">Write a Review</h3>
      
      {user && (
        <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
           <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
              {user.name?.charAt(0).toUpperCase()}
           </span>
           <span>Commenting as <span className="font-semibold text-gray-900">{user.name}</span></span>
        </div>
      )}

      {/* Rating Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="text-2xl focus:outline-none transition-colors"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setValue("rating", star, { shouldValidate: true })}
            >
              <FiStar
                className={`${
                  (hoverRating || rating) >= star
                    ? "fill-[#6A00EF] text-[#6A00EF]"
                    : "fill-transparent text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
        )}
      </div>

      {!user && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <label htmlFor="reviewer" className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            id="reviewer"
            {...register("reviewer")}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6A00EF]/20 focus:border-[#6A00EF] transition-all bg-white"
            placeholder="John Doe"
          />
          {errors.reviewer && (
            <p className="text-red-500 text-xs mt-1">{errors.reviewer.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reviewer_email" className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            id="reviewer_email"
            type="email"
            {...register("reviewer_email")}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6A00EF]/20 focus:border-[#6A00EF] transition-all bg-white"
            placeholder="john@example.com"
          />
          {errors.reviewer_email && (
            <p className="text-red-500 text-xs mt-1">{errors.reviewer_email.message}</p>
          )}
        </div>
      </div>
      )}

      {/* Review */}
      <div className="mb-4">
        <label htmlFor="review" className="block text-gray-700 font-medium mb-1">Your Review</label>
        <textarea
          id="review"
          {...register("review")}
          rows={4}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6A00EF]/20 focus:border-[#6A00EF] transition-all bg-white resize-none"
          placeholder="How was your experience?"
        />
        {errors.review && (
          <p className="text-red-500 text-xs mt-1">{errors.review.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-8 py-2.5 bg-[#6A00EF] text-white rounded-full font-semibold hover:bg-[#5800cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
