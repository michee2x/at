"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { VerificationMethod } from "@/types/verification.types";
import { submitVerification } from "@/lib/actions/dashboard/verification";

interface VerificationItemProps {
  method: VerificationMethod;
  onVerifyComplete?: () => void;
}

/**
 * VerificationItem Component
 *
 * Reusable component for displaying a single verification method
 * Handles state transitions from idle → uploading → success/error
 *
 * Features:
 * - Initial "Start Verification" button state
 * - File upload interface with drag-drop support
 * - Loading and error states
 * - Proper file validation
 */
export function VerificationItem({
  method,
  onVerifyComplete,
}: VerificationItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [isExpanded, setIsExpanded] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Determine accepted file types based on verification kind
  const getAcceptedFileTypes = useCallback(() => {
    if (method.kind === "address") {
      // Address verification typically needs documents
      return ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif";
    }
    // Custom verifications (ID, passport, license) usually accept images
    return "image/*,.pdf,.doc,.docx";
  }, [method.kind]);

  // Handle file input change
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      handleFiles(newFiles);
    },
    []
  );

  // Core file handling logic
  const handleFiles = useCallback((newFiles: File[]) => {
    setError(null);

    // Validate files
    if (newFiles.length === 0) return;

    // Check file sizes (max 5MB each for flexibility)
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Maximum size is 5MB.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(
          `File type "${file.type}" is not supported. Please upload images, PDF, or Word documents.`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    // Update files list
    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Handle drag-and-drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files || []);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  // Remove a file from the list
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Submit verification
  const handleSubmit = useCallback(async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitVerification(method.id, files);

      if (result.success) {
        setIsSuccess(true);
        setFiles([]);
        toast.success(result.message || "Verification submitted successfully");

        // Call the completion callback after a brief delay
        setTimeout(() => {
          onVerifyComplete?.();
        }, 1500);
      } else {
        setError(result.message || "Failed to submit verification");
        toast.error(result.message || "Failed to submit verification");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [files, method.id, onVerifyComplete]);

  // Reset form
  const handleCancel = useCallback(() => {
    setIsExpanded(false);
    setFiles([]);
    setError(null);
    setIsSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Start verification
  const handleStartVerification = useCallback(() => {
    setIsExpanded(true);
    setIsSuccess(false);
  }, []);

  // Render initial state - just the Start Verification button
  if (!isExpanded && !isSuccess) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{method.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{method.help_text}</p>
            {method.required && (
              <span className="mt-2 inline-block bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 rounded">
                Required
              </span>
            )}
          </div>
          <Button
            onClick={handleStartVerification}
            className="bg-violet-600 hover:bg-violet-700 text-white shrink-0"
          >
            Start Verification
          </Button>
        </div>
      </div>
    );
  }

  // Render expanded state - upload interface
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900">{method.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{method.help_text}</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {isSuccess ? (
        <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <p className="font-medium text-gray-900">
            Verification submitted successfully!
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Your documents have been received and will be reviewed shortly.
          </p>
        </div>
      ) : (
        <>
          {/* File Upload Area */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={getAcceptedFileTypes()}
            onChange={handleFileChange}
            disabled={isSubmitting}
          />

          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer mb-6",
              isDragActive
                ? "border-violet-600 bg-violet-50"
                : "border-gray-200 hover:border-violet-400 hover:bg-violet-50/30",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            onClick={() =>
              !isSubmitting && fileInputRef.current?.click()
            }
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isSubmitting ? (
              <div>
                <Loader2 className="h-10 w-10 text-violet-600 animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">
                  Uploading...
                </p>
              </div>
            ) : (
              <div>
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">
                  Drag and drop your files here, or click to select
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: Images, PDF, Word documents (Max 5MB each)
                </p>
              </div>
            )}
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Selected files ({files.length})
              </p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-violet-100 flex items-center justify-center shrink-0">
                        <Upload className="h-4 w-4 text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={files.length === 0 || isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
