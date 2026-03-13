import {
  NEXT_PUBLIC_NPT_DISPATCH_EMAIL,
  NEXT_PUBLIC_NPT_SAFETY_EMAIL,
  NEXT_PUBLIC_NPT_CS_EMAIL,
  NEXT_PUBLIC_NPT_IT_EMAIL,
} from "@/config/env";
import { EContactInquiryCategory } from "@/types/contactInquiry.types";

/**
 * Internal routing map for contact inquiries.
 *
 * Chosen mapping:
 * - CUSTOMER_SALES -> customer service / sales inbox
 * - CARRIERS -> dispatch inbox
 * - SAFETY -> safety inbox
 * - IT_SUPPORT -> IT inbox
 * - GENERAL -> customer service / sales inbox
 */
export const CONTACT_INQUIRY_DEPARTMENT_EMAILS: Record<EContactInquiryCategory, string> = {
  [EContactInquiryCategory.CUSTOMER_SALES]: NEXT_PUBLIC_NPT_CS_EMAIL,
  [EContactInquiryCategory.CARRIERS]: NEXT_PUBLIC_NPT_DISPATCH_EMAIL,
  [EContactInquiryCategory.SAFETY]: NEXT_PUBLIC_NPT_SAFETY_EMAIL,
  [EContactInquiryCategory.IT_SUPPORT]: NEXT_PUBLIC_NPT_IT_EMAIL,
  [EContactInquiryCategory.GENERAL]: NEXT_PUBLIC_NPT_CS_EMAIL,
};

export function getContactInquiryDepartmentEmail(
  category?: EContactInquiryCategory | string | null,
): string {
  if (!category) return NEXT_PUBLIC_NPT_CS_EMAIL;

  return (
    CONTACT_INQUIRY_DEPARTMENT_EMAILS[category as EContactInquiryCategory] ||
    NEXT_PUBLIC_NPT_CS_EMAIL
  );
}
