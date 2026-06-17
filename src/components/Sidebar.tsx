import { Compass, Download, Sparkles, PlusCircle, Settings } from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { LangThemeToggle } from '@/components/LangThemeToggle'
import { useI18n } from '@/i18n/I18nProvider'
import { prefetchPage } from '@/lib/prefetch-pages'
import clsx from 'clsx'

export type PageId = 'discover' | 'installed' | 'use' | 'create' | 'settings'

interface SidebarProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

const navItems: { id: PageId; icon: typeof Compass; labelKey: string }[] = [
  { id: 'discover', icon: Compass, labelKey: 'nav.discover' },
  { id: 'installed', icon: Download, labelKey: 'nav.installed' },
  { id: 'use', icon: Sparkles, labelKey: 'nav.use' },
  { id: 'create', icon: PlusCircle, labelKey: 'nav.create' },
  { id: 'settings', icon: Settings, labelKey: 'nav.settings' }
]

export function Sidebar({ activePage, onNavigate }: SidebarProps): React.ReactNode {
  const { t } = useI18n()

  return (
    <aside className="ds-sidebar w-[var(--app-sidebar-width)] shrink-0 flex flex-col border-e">
      <div className="p-6 border-b border-[var(--ds-sidebar-border)]">
        <div className="flex items-center gap-3">
          <AppIcon variant="logo" />
          <div>
            <h1 className="font-semibold text-text-primary tracking-tight">{t('app.title')}</h1>
            <p className="text-xs text-text-muted mt-0.5">{t('app.subtitle')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ id, icon: Icon, labelKey }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              onMouseEnter={() => prefetchPage(id)}
              onFocus={() => prefetchPage(id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                active
                  ? 'bg-[var(--ds-sidebar-row-active)] text-accent ring-1 ring-[var(--ds-sidebar-row-ring)]'
                  : 'text-text-secondary hover:bg-[var(--ds-sidebar-row-hover)] hover:text-text-primary'
              )}
            >
              <Icon className={clsx('w-[18px] h-[18px]', active && 'text-accent')} />
              {t(labelKey)}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[var(--ds-sidebar-border)] space-y-3">
        <LangThemeToggle />
        <a
          href="https://skills.sh"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
        >
          skills.sh
        </a>
      </div>
    </aside>
  )
}
