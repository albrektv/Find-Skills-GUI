import { FolderOpen } from 'lucide-react'

interface PathInputRowProps {
  value: string
  onChange: (value: string) => void
  onBrowse: () => void
  browseLabel: string
}

export function PathInputRow({
  value,
  onChange,
  onBrowse,
  browseLabel
}: PathInputRowProps): React.ReactNode {
  return (
    <div className="ds-path-field">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ds-path-field-input ds-input"
      />
      <button
        type="button"
        onClick={onBrowse}
        className="ds-path-field-browse ds-btn-secondary flex items-center gap-2 px-3 text-sm"
        title={browseLabel}
      >
        <FolderOpen className="w-4 h-4 shrink-0" />
        <span>{browseLabel}</span>
      </button>
    </div>
  )
}
