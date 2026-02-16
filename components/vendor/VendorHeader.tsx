"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VendorProfile } from "@/lib/actions/vendor/profile";

interface VendorHeaderProps {
  vendor: VendorProfile;
}

export function VendorHeader({ vendor }: VendorHeaderProps) {
  const socialIcons = {
    fb: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  return (
    <div className="bg-white border-b">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100">
        {vendor.banner && (
          <Image
            src={vendor.banner}
            alt={`${vendor.store_name} banner`}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Vendor Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 pb-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-xl">
              {vendor.gravatar ? (
                <Image
                  src={vendor.gravatar}
                  alt={vendor.store_name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                  {vendor.store_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Store Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{vendor.store_name}</h1>
              {vendor.shop_url && (
                <Link href={vendor.shop_url} target="_blank" className="text-violet-600 hover:text-violet-700 flex-shrink-0">
                  <ExternalLink className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(vendor.rating?.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {vendor.rating?.count ? `${vendor.rating.count} reviews` : "No ratings found yet!"}
              </span>
            </div>

            {/* Social Links */}
            {vendor.social && Object.values(vendor.social).some(url => url) && (
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(vendor.social).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform as keyof typeof socialIcons];
                  if (!Icon) return null;
                  
                  return (
                    <Link
                      key={platform}
                      href={url}
                      target="_blank"
                      className="text-gray-600 hover:text-violet-600 transition-colors"
                      aria-label={platform}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700">
              Follow
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              Get Support
            </Button>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
