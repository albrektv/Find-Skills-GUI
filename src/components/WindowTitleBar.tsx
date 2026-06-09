import { useI18n } from '@/i18n/I18nProvider'
import { AppIcon } from '@/components/AppIcon'

function supportsCustomTitleBar(): boolean {
  if (typeof window === 'undefined') return false
  const platform = window.skillsApi?.platform
  return platform === 'win32' || platform === 'linux'
}

export function WindowTitleBar(): React.ReactNode {
  const { t } = useI18n()

  if (!supportsCustomTitleBar()) return null

  return (
    <header className="ds-windows-titlebar shrink-0">
      <div className="ds-windows-titlebar-content">
        <div className="ds-windows-titlebar-brand">
          <div className="ds-windows-titlebar-icon overflow-hidden">
            <AppIcon size="xs" className="shadow-none" />
          </div>
          <span className="ds-windows-titlebar-title">{t('app.title')}</span>
        </div>
      </div>
    </header>
  )
}
