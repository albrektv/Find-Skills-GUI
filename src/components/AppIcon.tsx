import appIconUrl from '../../Res/icon.png'
import appLogoUrl from '../../Res/logo.png'
import clsx from 'clsx'

interface AppIconProps {
  className?: string
  size?: 'xs' | 'sm' | 'md'
  variant?: 'icon' | 'logo'
}

const sizeClasses = {
  xs: 'w-7 h-7 rounded-[var(--app-radius-sm)]',
  sm: 'w-8 h-8 rounded-[var(--app-radius-md)]',
  md: 'w-11 h-11 rounded-[var(--app-radius-xl)]'
} as const

export function AppIcon({
  className,
  size = 'md',
  variant = 'icon'
}: AppIconProps): React.ReactNode {
  return (
    <img
      src={variant === 'logo' ? appLogoUrl : appIconUrl}
      alt=""
      draggable={false}
      className={clsx(sizeClasses[size], 'object-cover shadow-sm', className)}
    />
  )
}

export { appIconUrl, appLogoUrl }
