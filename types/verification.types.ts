/**
 * Vendor Verification Types
 * Defines the structure for Dokan vendor verification methods and responses
 */

/**
 * Available verification method types
 * - "custom": Custom file/document upload (passport, license, etc.)
 * - "address": Address verification (document with address)
 * - "phone": Phone verification (handled separately)
 * - "social": Social profile verification
 */
export type VerificationKind = "custom" | "address" | "phone" | "social";

/**
 * Represents a single verification method
 */
export interface VerificationMethod {
  id: number;
  title: string;
  help_text: string;
  status: boolean; // Whether this verification method is enabled
  required: boolean; // Whether this verification is mandatory
  kind: VerificationKind;
  created_at: string;
  updated_at: string;
  seller_address?: string; // Only for "address" kind verification
}

/**
 * Phone verification settings
 */
export interface PhoneVerification {
  is_configured: boolean;
  active_gateway?: string;
  phone_status?: string;
  phone_no?: string;
}

/**
 * Social provider configuration
 */
export interface SocialProvider {
  id: string;
  name: string;
  help_text?: string;
}

/**
 * Complete vendor verification response from API
 */
export interface VendorVerificationResponse {
  verification_methods: VerificationMethod[];
  social_providers: SocialProvider[];
  phone_verification: PhoneVerification;
}

/**
 * Represents the submission state for a single verification method
 */
export interface VerificationSubmission {
  verification_id: number;
  files: File[];
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  message?: string;
}

/**
 * Request payload for submitting verification
 * Sent via FormData to support file uploads
 */
export interface VerificationSubmitPayload {
  verification_id: number;
  // Files are appended to FormData as "files[]"
}

/**
 * API response after successful verification submission
 */
export interface VerificationSubmitResponse {
  success: boolean;
  message?: string;
  verification_id?: number;
  status?: "pending" | "approved" | "rejected";
  data?: Record<string, unknown>;
}
