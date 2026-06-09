import { Search, X } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  loading?: boolean
}

export function SearchBar({ value, onChange, onSearch, loading }: SearchBarProps): React.ReactNode {
  const { t } = useI18n()

  return (
    <div className="relative flex-1 min-w-0">
      <Search
        className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder={t('discover.searchPlaceholder')}
        className="ds-composer w-full h-12 ps-12 pe-16 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="absolute inset-y-0 end-3 flex items-center gap-1.5">
        {loading && (
          <div
            className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0"
            aria-hidden
          />
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
