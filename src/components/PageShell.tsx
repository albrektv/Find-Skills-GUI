import clsx from 'clsx'

type PageWidth = 'narrow' | 'medium' | 'wide' | 'full'
type PageAlign = 'start' | 'center'

const widthClasses: Record<PageWidth, string> = {
  narrow: 'max-w-2xl',
  medium: 'max-w-3xl',
  wide: 'max-w-5xl',
  full: 'w-full max-w-none'
}

const alignClasses: Record<PageAlign, string> = {
  start: 'w-full',
  center: 'mx-auto w-full'
}

interface PageShellProps {
  header: React.ReactNode
  children: React.ReactNode
  width?: PageWidth
  align?: PageAlign
  bodyClassName?: string
}

export function PageShell({
  header,
  children,
  width = 'full',
  align = 'start',
  bodyClassName
}: PageShellProps): React.ReactNode {
  const containerClass = clsx(widthClasses[width], alignClasses[align])

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden">
      <header className="shrink-0 ds-page-header w-full">
        <div className={clsx(containerClass, 'ds-page-body py-5')}>{header}</div>
      </header>
      <div className="flex-1 overflow-y-auto w-full min-w-0 flex flex-col">
        <div
          className={clsx(
            containerClass,
            'ds-page-body flex-1 min-h-0 flex flex-col',
            bodyClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
