import { lazy, Suspense, useEffect, useState } from 'react'
import { Sidebar, type PageId } from '@/components/Sidebar'
import { WindowTitleBar } from '@/components/WindowTitleBar'
import { LogConsole } from '@/components/LogConsole'
import { PageSkeleton } from '@/components/PageSkeleton'
import { I18nProvider, useI18n } from '@/i18n/I18nProvider'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useJobStore } from '@/stores/useJobStore'
import { ipc } from '@/services/ipc'
import { applyTheme } from '@/lib/apply-theme'
import { prefetchPage } from '@/lib/prefetch-pages'

const DiscoverPage = lazy(() =>
  import('@/pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage }))
)
const InstalledPage = lazy(() =>
  import('@/pages/InstalledPage').then((m) => ({ default: m.InstalledPage }))
)
const UsePage = lazy(() => import('@/pages/UsePage').then((m) => ({ default: m.UsePage })))
const CreatePage = lazy(() =>
  import('@/pages/CreatePage').then((m) => ({ default: m.CreatePage }))
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)

function AppShell({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }): React.ReactNode {
  return (
    <div className="flex flex-col h-full w-full min-w-0 min-h-0">
      <WindowTitleBar />
      <div className="flex flex-1 w-full min-w-0 min-h-0">
        <Sidebar activePage={page} onNavigate={onNavigate} />
        <main className="flex-1 flex flex-col min-w-0 w-full relative bg-[var(--ds-bg-canvas)]">
          <div className="flex-1 min-h-0 overflow-hidden w-full flex flex-col">
            <Suspense
              fallback={
                <div className="ds-page-suspense-host">
                  <PageSkeleton page={page} />
                </div>
              }
            >
              <div key={page} className="ds-page-suspense-host ds-page-enter">
                {renderPage(page)}
              </div>
            </Suspense>
          </div>
        </main>
        <LogConsole />
      </div>
    </div>
  )
}

function renderPage(page: PageId): React.ReactNode {
  switch (page) {
    case 'discover':
      return <DiscoverPage />
    case 'installed':
      return <InstalledPage />
    case 'use':
      return <UsePage />
    case 'create':
      return <CreatePage />
    case 'settings':
      return <SettingsPage />
    default:
      return <DiscoverPage />
  }
}

function AppContent(): React.ReactNode {
  const [page, setPage] = useState<PageId>('discover')

  useEffect(() => {
    prefetchPage('discover')
  }, [])
  const { theme, installInternalSkills, disableTelemetry } = useSettingsStore()
  const { dir } = useI18n()
  const { appendLine, finishJob } = useJobStore()

  useEffect(() => {
    ipc.setSettings({ installInternalSkills, disableTelemetry }).catch(() => {})
  }, [installInternalSkills, disableTelemetry])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en')
  }, [dir])

  useEffect(() => {
    const unsubscribe = ipc.onJobStream((event) => {
      if (event.type === 'stdout' || event.type === 'stderr') {
        if (event.data) appendLine(event.jobId, event.data)
      }
      if (event.type === 'done' && event.result) {
        finishJob(event.jobId, event.result)
      }
    })
    return unsubscribe
  }, [appendLine, finishJob])

  return (
    <div className="flex h-full w-full min-h-0 bg-surface overflow-hidden">
      <AppShell page={page} onNavigate={setPage} />
    </div>
  )
}

export default function App(): React.ReactNode {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}
