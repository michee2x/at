"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import type {
  VendorVerificationResponse,
  VerificationSubmitResponse,
} from "@/types/verification.types";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

/**
 * Fetch all available verification methods for the vendor
 * @returns Verification methods and configuration
 */
export async function getVendorVerificationMethods(): Promise<
  VendorVerificationResponse | null
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized: No session found");
    }

    const wpToken = (session as any)?.wpToken;

    if (!wpToken) {
      throw new Error("Unauthorized: No WordPress Token");
    }

    const url = `${WC_API_URL}/wp-json/dokan/v1/vendor-verification?_locale=user`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${wpToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch verification methods (${response.status}):`,
        errorText
      );
      throw new Error("Failed to fetch verification methods");
    }

    const data = await response.json();
    return data as VendorVerificationResponse;
  } catch (error) {
    console.error("Error fetching vendor verification methods:", error);
    throw error;
  }
}

/**
 * Submit verification documents for a specific verification method
 * Handles file uploads via FormData
 *
 * @param verificationId - The verification method ID
 * @param files - Array of files to upload
 * @returns Response indicating success or failure
 */
export async function submitVerification(
  verificationId: number,
  files: File[]
): Promise<VerificationSubmitResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized: No session found");
    }

    const wpToken = (session as any)?.wpToken;

    if (!wpToken) {
      throw new Error("Unauthorized: No WordPress Token");
    }

    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    // Build FormData with files
    const formData = new FormData();
    formData.append("verification_id", verificationId.toString());

    files.forEach((file, index) => {
      formData.append("files[]", file, file.name);
    });

    const url = `${WC_API_URL}/wp-json/dokan/v1/vendor-verification`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${wpToken}`,
        // Content-Type is automatically set with FormData
      },
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const errorMessage =
        error?.message ||
        error?.details ||
        "Failed to submit verification";

      console.error(
        `Verification submission failed (${response.status}):`,
        error
      );

      return {
        success: false,
        message: errorMessage,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: data.message || "Verification submitted successfully",
      verification_id: verificationId,
      status: data.status || "pending",
      data: data.data || null,
    };
  } catch (error) {
    console.error("Error submitting verification:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

/**
 * Get the status of a specific verification submission
 * @param verificationId - The verification method ID
 * @returns Current verification status
 */
export async function getVerificationStatus(
  verificationId: number
): Promise<{
  status?: string;
  message?: string;
  verified?: boolean;
} | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized: No session found");
    }

    const wpToken = (session as any)?.wpToken;

    if (!wpToken) {
      throw new Error("Unauthorized: No WordPress Token");
    }

    const url = `${WC_API_URL}/wp-json/dokan/v1/vendor-verification/${verificationId}?_locale=user`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${wpToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch verification status (${response.status})`
      );
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return null;
  }
}
