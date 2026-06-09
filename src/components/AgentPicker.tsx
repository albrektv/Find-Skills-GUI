import clsx from 'clsx'
import { SUPPORTED_AGENTS } from '@/types/skills'
import { useI18n } from '@/i18n/I18nProvider'

interface AgentPickerProps {
  selected: string[]
  onChange: (agents: string[]) => void
}

export function AgentPicker({ selected, onChange }: AgentPickerProps): React.ReactNode {
  const { t } = useI18n()
  const allSelected = selected.includes('*')

  const toggleAgent = (agent: string): void => {
    if (agent === '*') {
      onChange(allSelected ? [] : ['*'])
      return
    }
    const withoutAll = selected.filter((a) => a !== '*')
    if (withoutAll.includes(agent)) {
      onChange(withoutAll.filter((a) => a !== agent))
    } else {
      onChange([...withoutAll, agent])
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">{t('install.agents')}</label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggleAgent('*')}
          className={clsx(
            'px-3 py-1.5 rounded-xl text-sm transition-colors',
            allSelected ? 'ds-chip ds-chip-active' : 'ds-chip text-text-secondary hover:text-text-primary'
          )}
        >
          *
        </button>
        {SUPPORTED_AGENTS.map((agent) => (
          <button
            key={agent}
            type="button"
            onClick={() => toggleAgent(agent)}
            disabled={allSelected}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-sm transition-colors',
              selected.includes(agent)
                ? 'ds-chip ds-chip-active'
                : 'ds-chip text-text-secondary hover:text-text-primary',
              allSelected && 'opacity-50 cursor-not-allowed'
            )}
          >
            {agent}
          </button>
        ))}
      </div>
    </div>
  )
}
