import clsx from 'clsx'
import type { PageId } from '@/components/Sidebar'
import { PageShell } from '@/components/PageShell'

function Bone({ className }: { className?: string }): React.ReactNode {
  return <div className={clsx('ds-skeleton', className)} aria-hidden />
}

function TitleHeaderSkeleton(): React.ReactNode {
  return (
    <div className="flex items-center gap-3 w-full">
      <Bone className="w-11 h-11 rounded-2xl shrink-0" />
      <div className="space-y-2 min-w-0 flex-1">
        <Bone className="h-5 w-40 max-w-full rounded-lg" />
        <Bone className="h-4 w-56 max-w-full rounded-md" />
      </div>
    </div>
  )
}

function DiscoverHeaderSkeleton(): React.ReactNode {
  return (
    <div className="flex items-center gap-4 w-full min-w-0">
      <Bone className="h-12 flex-1 min-w-0 rounded-[18px]" />
      <Bone className="h-12 w-28 rounded-xl shrink-0" />
    </div>
  )
}

function InstalledHeaderSkeleton(): React.ReactNode {
  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex items-center justify-between gap-4 flex-wrap w-full">
        <Bone className="h-7 w-44 rounded-lg" />
        <div className="flex items-center gap-2">
          <Bone className="h-9 w-24 rounded-xl" />
          <Bone className="h-9 w-32 rounded-xl" />
          <Bone className="h-9 w-36 rounded-xl" />
        </div>
      </div>
      <div className="flex items-center gap-3 w-full">
        <Bone className="h-9 w-36 rounded-xl" />
        <Bone className="h-9 w-36 rounded-xl" />
      </div>
    </div>
  )
}

function FormPanelSkeleton({ stacked = false }: { stacked?: boolean }): React.ReactNode {
  return (
    <div className={clsx('ds-split-page w-full min-w-0', stacked && 'ds-split-page--stack')}>
      <div className="ds-split-page-form w-full min-w-0">
        <div className="space-y-2 w-full">
          <Bone className="h-4 w-24 rounded-md" />
          <Bone className="h-12 w-full rounded-[14px]" />
        </div>
        <div className="space-y-2 w-full">
          <Bone className="h-4 w-28 rounded-md" />
          <Bone className="h-12 w-full rounded-[14px]" />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full min-w-0">
          <Bone className="h-12 w-full rounded-[14px]" />
          <Bone className="h-12 w-full rounded-[14px]" />
        </div>
        <Bone className="h-11 w-36 rounded-xl" />
      </div>
      <div className="ds-split-page-panel ds-card p-6 w-full min-w-0">
        <Bone className="h-4 w-24 rounded-md" />
        <div className="flex-1 space-y-3 pt-1 w-full">
          <Bone className="h-4 w-full rounded-md" />
          <Bone className="h-4 w-[92%] rounded-md" />
          <Bone className="h-4 w-[78%] rounded-md" />
          <Bone className="h-4 w-[85%] rounded-md" />
        </div>
      </div>
    </div>
  )
}

function CardGridSkeleton({ count = 6 }: { count?: number }): React.ReactNode {
  return (
    <div className="grid grid-cols-2 gap-4 w-full min-w-0">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="ds-card p-5 space-y-3 w-full min-w-0">
          <div className="flex items-start justify-between gap-3 w-full">
            <div className="flex-1 space-y-2 min-w-0">
              <Bone className="h-5 w-3/4 rounded-md" />
              <Bone className="h-3 w-1/2 rounded-md" />
            </div>
            <Bone className="h-6 w-16 rounded-full shrink-0" />
          </div>
          <Bone className="h-10 w-full rounded-lg" />
          <div className="flex items-center gap-2 pt-1 w-full">
            <Bone className="h-8 w-20 rounded-xl" />
            <Bone className="h-8 w-8 rounded-xl" />
            <Bone className="h-8 w-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SettingsSkeleton(): React.ReactNode {
  return (
    <div className="ds-settings-columns w-full min-w-0">
      <div className="ds-settings-column">
        <div className="ds-card p-5 space-y-3 ds-settings-card">
          <Bone className="h-4 w-20 rounded-md" />
          <div className="flex gap-2 w-full">
            <Bone className="h-10 flex-1 rounded-xl" />
            <Bone className="h-10 flex-1 rounded-xl" />
            <Bone className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
        <div className="ds-card p-5 space-y-3 ds-settings-card">
          <Bone className="h-4 w-24 rounded-md" />
          <div className="flex gap-2 w-full">
            <Bone className="h-10 flex-1 rounded-xl" />
            <Bone className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="ds-settings-column">
        <div className="ds-card p-5 space-y-3 ds-settings-card">
          <Bone className="h-4 w-36 rounded-md" />
          <Bone className="h-12 w-full rounded-[14px]" />
        </div>
        <div className="ds-card p-5 space-y-3 ds-settings-card">
          <Bone className="h-4 w-32 rounded-md" />
          <div className="flex flex-col gap-2 w-full">
            <Bone className="h-10 w-full rounded-xl" />
            <Bone className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="ds-card p-5 space-y-3 ds-settings-card">
          <Bone className="h-4 w-40 rounded-md" />
          <Bone className="h-4 w-36 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function InstalledListSkeleton(): React.ReactNode {
  return (
    <div className="grid grid-cols-2 gap-3 w-full min-w-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-3 rounded-2xl ds-card w-full min-w-0">
          <Bone className="w-4 h-4 rounded shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Bone className="h-4 w-2/3 rounded-md" />
            <Bone className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

function renderHeader(page: PageId): React.ReactNode {
  switch (page) {
    case 'discover':
      return <DiscoverHeaderSkeleton />
    case 'installed':
      return <InstalledHeaderSkeleton />
    default:
      return <TitleHeaderSkeleton />
  }
}

function renderBody(page: PageId): React.ReactNode {
  switch (page) {
    case 'discover':
      return (
        <div className="w-full min-w-0">
          <Bone className="h-3 w-28 rounded-md mb-4" />
          <CardGridSkeleton />
        </div>
      )
    case 'installed':
      return <InstalledListSkeleton />
    case 'settings':
      return <SettingsSkeleton />
    case 'use':
    case 'create':
      return <FormPanelSkeleton stacked />
    default:
      return <FormPanelSkeleton />
  }
}

interface PageSkeletonProps {
  page: PageId
}

export function PageSkeleton({ page }: PageSkeletonProps): React.ReactNode {
  return (
    <PageShell
      width="full"
      header={renderHeader(page)}
      bodyClassName="ds-page-enter"
    >
      {renderBody(page)}
    </PageShell>
  )
}
