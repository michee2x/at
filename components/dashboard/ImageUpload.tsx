"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Changed: Now stores File objects with preview URLs
export interface ImageFile {
  id?: number;
  file: File;
  preview: string;
}

interface ImageUploadProps {
  value: ImageFile[];
  onChange: (value: ImageFile[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newItems: ImageFile[] = [];

    files.forEach(file => {
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
        disabled={disabled}
      />

      {value.length === 0 ? (
        /* Empty State: Big Dropzone */
        <div 
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-gray-50 h-64",
            dragActive ? "border-[#6a00f3] bg-purple-50" : "border-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="p-4 bg-white rounded-full shadow-sm border">
            <Upload className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="font-medium text-sm text-gray-900">
              Click to upload <span className="text-gray-500 font-normal">or drag and drop</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF</p>
          </div>
        </div>
      ) : (
        /* Filled State: Grid of Images + "Add More" Button */
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {value.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-white group shadow-sm">
              <Image
                fill
                src={image.preview}
                alt={`Product image ${index + 1}`}
                className="object-cover"
              />
              <div className="absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  type="button" 
                  size="icon" 
                  variant="destructive" 
                  className="h-6 w-6 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center backdrop-blur-sm">
                  Cover Image
                </div>
              )}
            </div>
          ))}
          
          {/* "Add More" Button */}
          <div 
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#6a00f3] hover:bg-purple-50 transition-colors",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <Upload className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground font-medium">Add More</span>
          </div>
        </div>
      )}
    </div>
  );
}
