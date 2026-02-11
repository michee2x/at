/**
 * Profile Completion Utilities
 * Calculates vendor profile completion percentage and provides guidance
 */

export interface StoreData {
  store_name?: string;
  phone?: string;
  address?: any;
  banner?: string;
  banner_id?: number;
  gravatar?: string;
  gravatar_id?: number;
  vendor_biography?: string;
  company_name?: string;
  bank_name?: string;
  bank_iban?: string;
  social?: {
    fb?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    flickr?: string;
    threads?: string;
  };
  vat_number?: string;
  company_id_number?: string;
  store_toc?: string;
}

export interface ProfileCompletionResult {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
  nextSteps: string[];
}

/**
 * Check if a field has a meaningful value
 */
function hasValue(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return value > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return false;
}

/**
 * Count filled social media links
 */
function countSocialLinks(social?: StoreData['social']): number {
  if (!social) return 0;
  return Object.values(social).filter(url => hasValue(url)).length;
}

/**
 * Check if address is filled
 */
function hasAddress(address: any): boolean {
  if (!address) return false;
  if (Array.isArray(address)) return address.length > 0;
  if (typeof address === 'object') {
    return Object.values(address).some(val => hasValue(val));
  }
  return false;
}

/**
 * Calculate profile completion percentage with weighted scoring
 */
export function calculateProfileCompletion(storeData: StoreData): ProfileCompletionResult {
  let totalScore = 0;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  // Essential Fields (60% total)
  const essentialFields = [
    { key: 'store_name', label: 'Store Name', weight: 15, check: () => hasValue(storeData.store_name) },
    { key: 'phone', label: 'Phone Number', weight: 10, check: () => hasValue(storeData.phone) },
    { key: 'address', label: 'Store Address', weight: 15, check: () => hasAddress(storeData.address) },
    { key: 'banner', label: 'Store Banner', weight: 10, check: () => hasValue(storeData.banner) || hasValue(storeData.banner_id) },
    { key: 'gravatar', label: 'Profile Picture', weight: 10, check: () => hasValue(storeData.gravatar) || hasValue(storeData.gravatar_id) },
  ];

  // Important Fields (30% total)
  const importantFields = [
    { key: 'vendor_biography', label: 'Store Biography', weight: 10, check: () => hasValue(storeData.vendor_biography) },
    { key: 'company_name', label: 'Company Name', weight: 5, check: () => hasValue(storeData.company_name) },
    { key: 'bank_details', label: 'Bank Details', weight: 10, check: () => hasValue(storeData.bank_name) && hasValue(storeData.bank_iban) },
    { key: 'social', label: 'Social Media Links', weight: 5, check: () => countSocialLinks(storeData.social) >= 2 },
  ];

  // Optional Fields (10% total)
  const optionalFields = [
    { key: 'vat_number', label: 'VAT Number', weight: 3, check: () => hasValue(storeData.vat_number) },
    { key: 'company_id_number', label: 'Company ID', weight: 3, check: () => hasValue(storeData.company_id_number) },
    { key: 'store_toc', label: 'Terms & Conditions', weight: 4, check: () => hasValue(storeData.store_toc) },
  ];

  // Calculate scores
  const allFields = [...essentialFields, ...importantFields, ...optionalFields];
  
  allFields.forEach(field => {
    if (field.check()) {
      totalScore += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  });

  return {
    percentage: Math.round(totalScore),
    missingFields,
    completedFields,
    nextSteps: getNextSteps(storeData, missingFields),
  };
}

/**
 * Get contextual message based on completion percentage
 */
export function getCompletionMessage(percentage: number): string {
  if (percentage === 0) {
    return "Start with adding a Banner to gain profile progress";
  } else if (percentage <= 25) {
    return "Start with adding a Banner to gain profile progress";
  } else if (percentage <= 50) {
    return "Add your store address and contact information";
  } else if (percentage <= 75) {
    return "Complete your company details and payment information";
  } else if (percentage < 100) {
    return "Almost there! Add your biography and social links";
  } else {
    return "🎉 Your profile is complete! You're all set to sell";
  }
}

/**
 * Get next recommended actions based on missing fields
 */
function getNextSteps(storeData: StoreData, missingFields: string[]): string[] {
  const steps: string[] = [];

  // Prioritize essential fields
  if (!hasValue(storeData.banner) && !hasValue(storeData.banner_id)) {
    steps.push("Add a store banner image");
  }
  if (!hasValue(storeData.store_name)) {
    steps.push("Set your store name");
  }
  if (!hasAddress(storeData.address)) {
    steps.push("Complete your store address");
  }
  if (!hasValue(storeData.phone)) {
    steps.push("Add your phone number");
  }
  if (!hasValue(storeData.gravatar) && !hasValue(storeData.gravatar_id)) {
    steps.push("Upload a profile picture");
  }

  // Then important fields
  if (!hasValue(storeData.vendor_biography)) {
    steps.push("Write your store biography");
  }
  if (!hasValue(storeData.bank_name) || !hasValue(storeData.bank_iban)) {
    steps.push("Set up your payment details");
  }
  if (countSocialLinks(storeData.social) < 2) {
    steps.push("Add at least 2 social media links");
  }

  return steps.slice(0, 3); // Return top 3 priorities
}
