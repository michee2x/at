"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

interface MediaUploadProps {
  value?: string; // URL for preview
  onChange: (url: string, id: number) => void;
  disabled?: boolean;
  className?: string;
  width?: number;
  height?: number;
  label?: string;
  circle?: boolean; // For profile pictures
}

export function MediaUpload({ 
  value, 
  onChange, 
  disabled, 
  className,
  width = 800,
  height = 400,
  label = "Upload Image",
  circle = false
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadToWordPress = async (file: File) => {
    setIsUploading(true);
    try {
      // Get session for token
      const session = await getSession();
      const token = (session as any)?.wpToken;

      if (!token) {
        throw new Error("Authentication failed");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      formData.append("caption", "Uploaded via Dashboard");

      // Use public URL for client-side upload or proxy API route if CORS is an issue
      // Ideally this should be a server action but File uploads in Server Actions are tricky in some Next.js versions
      // We'll use a standard fetch to the WP API
      const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com"}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Content-Type is set automatically with FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      
      // Return URL and ID
      onChange(data.source_url, data.id);
      toast.success("Image uploaded successfully");
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      uploadToWordPress(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      uploadToWordPress(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", 0);
  };

  return (
    <div className={className}>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {value ? (
        /* Preview State */
        <div 
          className={cn(
            "relative group border rounded-lg overflow-hidden bg-gray-100",
            circle ? "rounded-full aspect-square w-32 h-32 mx-auto" : "aspect-[3/1] w-full"
          )}
        >
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeImage}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        /* Upload State */
        <div 
          className={cn(
            "border-2 border-dashed border-gray-200 hover:border-violet-400 hover:bg-violet-50/50 transition-colors p-6 text-center cursor-pointer group flex flex-col items-center justify-center",
            dragActive && "border-violet-600 bg-violet-50",
            circle ? "rounded-full aspect-square w-32 h-32 mx-auto" : "rounded-xl",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
          ) : (
            <>
              <div 
                className={cn(
                  "bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-violet-100 transition-colors",
                  circle ? "w-8 h-8" : "w-12 h-12"
                )}
              >
                {circle ? (
                   <div className="h-4 w-4 text-gray-400 group-hover:text-violet-600">👤</div>
                ) : (
                   <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-violet-600" />
                )}
              </div>
              {!circle && (
                <>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
                </>
              )}
              {circle && (
                 <p className="text-xs font-medium text-gray-600">Upload</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
