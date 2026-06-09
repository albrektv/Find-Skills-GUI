import clsx from 'clsx'
import { useI18n } from '@/i18n/I18nProvider'

interface ScopeToggleProps {
  global: boolean
  onChange: (global: boolean) => void
}

export function ScopeToggle({ global, onChange }: ScopeToggleProps): React.ReactNode {
  const { t } = useI18n()

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">{t('install.scope')}</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={clsx(
            'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
            !global ? 'ds-chip ds-chip-active' : 'ds-chip text-text-secondary hover:text-text-primary'
          )}
        >
          {t('installed.project')}
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={clsx(
            'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
            global ? 'ds-chip ds-chip-active' : 'ds-chip text-text-secondary hover:text-text-primary'
          )}
        >
          {t('installed.global')}
        </button>
      </div>
    </div>
  )
}
