"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Store, UserMinus } from "lucide-react";

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  banner: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  address: string;
  isFollowing: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Banner */}
      <div className="relative h-24 w-full bg-gray-100">
        {vendor.banner ? (
          <Image
            src={vendor.banner}
            alt={`${vendor.name} banner`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-gray-100 to-gray-200" />
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-col px-5 pb-5 pt-12">
        {/* Avatar (Floating) */}
        <div className="absolute -top-10 left-5 h-20 w-20 overflow-hidden rounded-xl border-4 border-white shadow-sm bg-white">
          {vendor.avatar ? (
            <Image
              src={vendor.avatar}
              alt={vendor.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300">
              <Store className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
             <Link href={`/store/${vendor.slug}`} className="group-hover:text-[#6a00f3] transition-colors">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{vendor.name}</h3>
             </Link>
             <div className="flex items-center gap-1 text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span>{vendor.rating.toFixed(1)}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
             <MapPin className="h-3.5 w-3.5" />
             <span className="line-clamp-1">{vendor.address}</span>
          </div>
          <p className="text-xs text-gray-400">{vendor.reviewCount} Reviews</p>
        </div>

        {/* Actions */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          <Link href={`/store/${vendor.slug}`} className="w-full">
            <Button className="w-full bg-[#6a00f3] hover:bg-[#5a00d3] text-white">
              Visit Store
            </Button>
          </Link>
          <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 group/unfollow">
            <span className="group-hover/unfollow:hidden">Following</span>
            <span className="hidden group-hover/unfollow:inline-flex items-center gap-2">
                <UserMinus className="h-4 w-4" /> Unfollow
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
