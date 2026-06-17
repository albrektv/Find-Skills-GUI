import { Minus, X } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { ipc } from '@/services/ipc'

export function WindowControls(): React.ReactNode {
  const { t } = useI18n()

  return (
    <div className="ds-window-controls">
      <button
        type="button"
        className="ds-window-control-btn"
        aria-label={t('window.minimize')}
        onClick={() => ipc.minimizeWindow()}
      >
        <Minus className="w-4 h-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className="ds-window-control-btn ds-window-control-btn--close"
        aria-label={t('window.close')}
        onClick={() => ipc.closeWindow()}
      >
        <X className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}
