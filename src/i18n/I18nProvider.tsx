import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import en from './en.json'
import ar from './ar.json'

type Messages = typeof en

interface I18nContextValue {
  t: (key: string) => string
  language: 'en' | 'ar'
  dir: 'ltr' | 'rtl'
}

const messages: Record<'en' | 'ar', Messages> = { en, ar }

const I18nContext = createContext<I18nContextValue | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

export function I18nProvider({ children }: { children: ReactNode }): ReactNode {
  const language = useSettingsStore((s) => s.language)
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      dir,
      t: (key) => getNestedValue(messages[language] as Record<string, unknown>, key)
    }),
    [language]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
