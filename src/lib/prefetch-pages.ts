import type { PageId } from '@/components/Sidebar'

const prefetchers: Record<PageId, () => Promise<unknown>> = {
  discover: () => import('@/pages/DiscoverPage'),
  installed: () => import('@/pages/InstalledPage'),
  use: () => import('@/pages/UsePage'),
  create: () => import('@/pages/CreatePage'),
  settings: () => import('@/pages/SettingsPage')
}

const prefetched = new Set<PageId>()

export function prefetchPage(page: PageId): void {
  if (prefetched.has(page)) return
  prefetched.add(page)
  void prefetchers[page]()
}
