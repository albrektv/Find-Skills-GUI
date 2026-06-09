import { useEffect } from 'react'
import { Settings, Monitor, Sun, Moon } from 'lucide-react'
import { PathInputRow } from '@/components/PathInputRow'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useI18n } from '@/i18n/I18nProvider'
import { ipc } from '@/services/ipc'
import { PageShell } from '@/components/PageShell'
import clsx from 'clsx'
import type { Theme } from '@/types/skills'

const THEME_OPTIONS: { value: Theme; icon: typeof Monitor; labelKey: string }[] = [
  { value: 'system', icon: Monitor, labelKey: 'settings.system' },
  { value: 'light', icon: Sun, labelKey: 'settings.light' },
  { value: 'dark', icon: Moon, labelKey: 'settings.dark' }
]

export function SettingsPage(): React.ReactNode {
  const { t } = useI18n()
  const {
    theme,
    language,
    projectDir,
    installMethod,
    installInternalSkills,
    disableTelemetry,
    setTheme,
    setLanguage,
    setProjectDir,
    setInstallMethod,
    setInstallInternalSkills,
    setDisableTelemetry
  } = useSettingsStore()

  useEffect(() => {
    if (!projectDir) {
      ipc.getCwd().then(setProjectDir).catch(() => {})
    }
  }, [projectDir, setProjectDir])

  const handleBrowse = async (): Promise<void> => {
    const picked = await ipc.pickFolder()
    if (picked) setProjectDir(picked)
  }

  return (
    <PageShell
      width="full"
      header={
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/25 to-accent/10 flex items-center justify-center ring-1 ring-accent/20">
            <Settings className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary tracking-tight">{t('settings.title')}</h2>
        </div>
      }
    >
      <div className="ds-settings-columns">
        <div className="ds-settings-column">
          <section className="space-y-3 ds-card p-5 ds-settings-card">
            <label className="text-sm font-medium text-text-secondary">{t('settings.theme')}</label>
            <div className="flex gap-2 min-w-0">
              {THEME_OPTIONS.map(({ value, icon: Icon, labelKey }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={clsx(
                    'flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    theme === value
                      ? 'ds-chip ds-chip-active'
                      : 'ds-chip text-text-secondary hover:text-text-primary'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t(labelKey)}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3 ds-card p-5 ds-settings-card">
            <label className="text-sm font-medium text-text-secondary">{t('settings.language')}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={clsx(
                  'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  language === 'en'
                    ? 'ds-chip ds-chip-active'
                    : 'ds-chip text-text-secondary hover:text-text-primary'
                )}
              >
                {t('settings.english')}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={clsx(
                  'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  language === 'ar'
                    ? 'ds-chip ds-chip-active'
                    : 'ds-chip text-text-secondary hover:text-text-primary'
                )}
              >
                {t('settings.arabic')}
              </button>
            </div>
          </section>
        </div>

        <div className="ds-settings-column">
          <section className="space-y-3 ds-card p-5 ds-settings-card">
            <label className="text-sm font-medium text-text-secondary">{t('settings.projectDir')}</label>
            <PathInputRow
              value={projectDir}
              onChange={setProjectDir}
              onBrowse={handleBrowse}
              browseLabel={t('settings.browse')}
            />
          </section>

          <section className="space-y-3 ds-card p-5 ds-settings-card">
            <label className="text-sm font-medium text-text-secondary">{t('settings.installMethod')}</label>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setInstallMethod('symlink')}
                className={clsx(
                  'w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-start',
                  installMethod === 'symlink'
                    ? 'ds-chip ds-chip-active'
                    : 'ds-chip text-text-secondary hover:text-text-primary'
                )}
              >
                {t('install.symlink')}
              </button>
              <button
                type="button"
                onClick={() => setInstallMethod('copy')}
                className={clsx(
                  'w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-start',
                  installMethod === 'copy'
                    ? 'ds-chip ds-chip-active'
                    : 'ds-chip text-text-secondary hover:text-text-primary'
                )}
              >
                {t('install.copy')}
              </button>
            </div>
          </section>

          <section className="space-y-4 ds-card p-5 ds-settings-card">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={installInternalSkills}
                onChange={(e) => setInstallInternalSkills(e.target.checked)}
                className="w-4 h-4 rounded accent-accent shrink-0"
              />
              <span className="text-sm text-text-secondary">{t('settings.internalSkills')}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={disableTelemetry}
                onChange={(e) => setDisableTelemetry(e.target.checked)}
                className="w-4 h-4 rounded accent-accent shrink-0"
              />
              <span className="text-sm text-text-secondary">{t('settings.disableTelemetry')}</span>
            </label>
            <p className="text-xs text-text-muted pt-1">{t('settings.save')}</p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
