import { z } from 'zod'
import type { ContactValidationKey } from '@/features/contact/types'

const PHONE_PATTERN = /^\+?[\d\s()/-]{6,}$/

// Error messages are i18n keys (see contact.validation); the form translates them.
const validationKey = (key: ContactValidationKey) => key

export const contactInquirySchema = z.object({
  fullName: z.string().trim().min(2, validationKey('fullName')),
  email: z.email(validationKey('email')),
  phone: z
    .string()
    .trim()
    .refine((phone) => phone === '' || PHONE_PATTERN.test(phone), {
      message: validationKey('phone'),
    }),
  consultationTopic: z.string().min(1, validationKey('consultationTopic')),
  message: z.string().trim().max(1000, validationKey('message')),
  hasAcceptedPrivacyPolicy: z
    .boolean()
    .refine((hasAccepted) => hasAccepted, validationKey('privacyConsent')),
})

export type ContactInquiry = z.infer<typeof contactInquirySchema>
