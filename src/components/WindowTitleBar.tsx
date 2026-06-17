import { useI18n } from '@/i18n/I18nProvider'
import { AppIcon } from '@/components/AppIcon'
import { WindowControls } from '@/components/WindowControls'

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
      <div className="ds-windows-titlebar-sidebar-zone">
        <div className="ds-windows-titlebar-brand">
          <div className="ds-windows-titlebar-icon overflow-hidden">
            <AppIcon size="xs" className="shadow-none" />
          </div>
          <span className="ds-windows-titlebar-title">{t('app.title')}</span>
        </div>
      </div>
      <div className="ds-windows-titlebar-main-zone" aria-hidden="true" />
      <WindowControls />
    </header>
  )
}
