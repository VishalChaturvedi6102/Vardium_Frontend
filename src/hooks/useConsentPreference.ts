import { useLocalStorage } from '@/hooks/useLocalStorage'

export type ConsentPreference = 'all' | 'necessary' | null

const CONSENT_STORAGE_KEY = 'vardium.consentPreference'

export function useConsentPreference() {
  return useLocalStorage<ConsentPreference>(CONSENT_STORAGE_KEY, null)
}
