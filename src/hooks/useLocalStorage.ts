import { useState } from 'react'

export function useLocalStorage<StoredValue>(
  storageKey: string,
  initialValue: StoredValue,
): [StoredValue, (nextValue: StoredValue) => void] {
  const [storedValue, setStoredValue] = useState<StoredValue>(() => {
    try {
      const rawValue = window.localStorage.getItem(storageKey)
      return rawValue === null ? initialValue : (JSON.parse(rawValue) as StoredValue)
    } catch {
      return initialValue
    }
  })

  const updateStoredValue = (nextValue: StoredValue) => {
    setStoredValue(nextValue)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextValue))
    } catch {
      // Storage blocked (private mode): keep the in-memory value only
    }
  }

  return [storedValue, updateStoredValue]
}
