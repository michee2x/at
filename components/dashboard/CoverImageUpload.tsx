"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Replace } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageFile } from "./ImageUpload";

interface CoverImageUploadProps {
  value: ImageFile | null;
  onChange: (value: ImageFile | null) => void;
  disabled?: boolean;
}

export function CoverImageUpload({ value, onChange, disabled }: CoverImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    // Revoke old object URL if exists
    if (value?.preview) {
      URL.revokeObjectURL(value.preview);
    }

    const preview = URL.createObjectURL(file);
    onChange({ file, preview });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (value?.preview) {
      URL.revokeObjectURL(value.preview);
    }
    onChange(null);
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
      handleFiles(e.dataTransfer.files[0]);
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
        onChange={handleFileChange}
        disabled={disabled}
      />

      <div 
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden min-h-[300px]",
          dragActive ? "border-[#6a00f3] bg-purple-50" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50",
          disabled && "opacity-50 cursor-not-allowed",
          value && "border-solid border-gray-200 p-0"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {value ? (
          <>
            <Image
              fill
              src={value.preview}
              alt="Cover image"
              className="object-cover"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Replace className="h-4 w-4 mr-2" />
                  Replace
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  className="shadow-sm"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center p-8">
            <div className="p-4 bg-white rounded-full shadow-sm border mx-auto mb-4 w-fit">
              <ImageIcon className="h-8 w-8 text-gray-500" />
            </div>
            <p className="font-medium text-lg text-gray-900">
              Set Cover Image
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-[200px] mx-auto">
              Click to upload or drag and drop your main product image
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
