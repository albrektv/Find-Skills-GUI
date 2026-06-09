import { Monitor, Moon, Sun, Languages } from 'lucide-react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useI18n } from '@/i18n/I18nProvider'
import type { Theme } from '@/types/skills'

const THEME_CYCLE: Theme[] = ['system', 'light', 'dark']

function nextTheme(current: Theme): Theme {
  const index = THEME_CYCLE.indexOf(current)
  return THEME_CYCLE[(index + 1) % THEME_CYCLE.length]
}

function ThemeIcon({ theme }: { theme: Theme }): React.ReactNode {
  if (theme === 'light') return <Sun className="w-4 h-4" />
  if (theme === 'dark') return <Moon className="w-4 h-4" />
  return <Monitor className="w-4 h-4" />
}

export function LangThemeToggle(): React.ReactNode {
  const { theme, language, setTheme, setLanguage } = useSettingsStore()
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="ds-chip flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary"
        title={t('settings.language')}
      >
        <Languages className="w-4 h-4" />
        <span>{language === 'en' ? 'AR' : 'EN'}</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme(nextTheme(theme))}
        className="ds-chip flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary min-w-0"
        title={t(`settings.${theme}`)}
      >
        <ThemeIcon theme={theme} />
        <span className="truncate">{t(`settings.${theme}`)}</span>
      </button>
    </div>
  )
}
