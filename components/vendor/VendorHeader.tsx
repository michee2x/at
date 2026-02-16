"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Share2, Heart } from "lucide-react";
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
      <div className="relative h-64 w-full bg-gradient-to-r from-violet-100 to-purple-100">
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

      {/* Vendor Info */}
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 pb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
              {vendor.gravatar ? (
                <Image
                  src={vendor.gravatar}
                  alt={vendor.store_name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {vendor.store_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Store Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{vendor.store_name}</h1>
              <Link href={vendor.shop_url || "#"} target="_blank" className="text-violet-600 hover:text-violet-700">
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>

            {/* Rating */}
            {vendor.rating && (
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
                  No ratings found yet!
                </span>
              </div>
            )}

            {/* Social Links */}
            {vendor.social && (
              <div className="flex items-center gap-3 mb-4">
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
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="bg-violet-600 hover:bg-violet-700">
              <Heart className="mr-2 h-4 w-4" />
              Follow
            </Button>
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Get Support
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
