"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Duplicate type definition to be self-contained
export interface ImageFile {
  file: File;
  preview: string;
}

interface GalleryImageUploadProps {
  value: ImageFile[];
  onChange: (value: ImageFile[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export function GalleryImageUpload({ value, onChange, disabled, maxImages = 20 }: GalleryImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = files.slice(0, remainingSlots);
    const newItems: ImageFile[] = [];

    filesToProcess.forEach(file => {
      if (!file.type.startsWith("image/")) return;
      
      const preview = URL.createObjectURL(file);
      newItems.push({ file, preview });
    });

    if (newItems.length === 0) return;

    // Add to existing images
    onChange([...value, ...newItems]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    // Revoke the blob URL to free memory
    const imageToRemove = value[indexToRemove];
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onChange(value.filter((_, index) => index !== indexToRemove));
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple 
        onChange={handleFileChange}
        disabled={disabled || value.length >= maxImages}
      />

       <div className="grid grid-cols-4 gap-4">
          {value.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-white group shadow-sm">
              <Image
                fill
                src={image.preview}
                alt={`Gallery image ${index + 1}`}
                className="object-cover"
              />
              <div className="absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  type="button" 
                  size="icon" 
                  variant="destructive" 
                  className="h-5 w-5 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* "Add More" Tile - Show if not at max limit */}
          {value.length < maxImages && (
            <div 
              className={cn(
                "aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#6a00f3] hover:bg-purple-50 transition-colors bg-gray-50/50",
                disabled && "opacity-50 cursor-not-allowed",
                dragActive && "border-[#6a00f3] bg-purple-50"
              )}
              onClick={() => !disabled && fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-[10px] text-muted-foreground font-medium text-center px-1">
                Add Images <br/>
                <span className="text-gray-400 font-normal">({value.length}/{maxImages})</span>
              </span>
            </div>
          )}
        </div>
    </div>
  );
}
