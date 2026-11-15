import type { ContactInquiry } from '@/features/contact/schemas/contactInquirySchema'

const SIMULATED_REQUEST_DELAY_MS = 600

// Stub: no backend yet — replace with the CRM/API request.
export async function submitContactInquiry(
  contactInquiry: ContactInquiry,
): Promise<ContactInquiry> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_REQUEST_DELAY_MS))
  return contactInquiry
}
