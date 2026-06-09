import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Trash2, ArrowUpCircle, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import { useInstalledStore } from '@/stores/useInstalledStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useJobStore } from '@/stores/useJobStore'
import { useI18n } from '@/i18n/I18nProvider'
import { ipc } from '@/services/ipc'
import { PageShell } from '@/components/PageShell'
import { SUPPORTED_AGENTS } from '@/types/skills'
import { parseUpdateSummary, type UpdateSummary } from '@/lib/cli-output'

export function InstalledPage(): React.ReactNode {
  const { t } = useI18n()
  const { skills, loading, error, scopeFilter, agentFilter, setScopeFilter, setAgentFilter, refresh } =
    useInstalledStore()
  const { projectDir } = useSettingsStore()
  const { startJob, finishJob } = useJobStore()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<UpdateSummary | null>(null)

  useEffect(() => {
    refresh()
  }, [refresh])

  const filtered = useMemo(() => {
    return skills.filter((skill) => {
      if (scopeFilter !== 'all' && skill.scope !== scopeFilter) return false
      if (agentFilter && skill.agent !== agentFilter) return false
      return true
    })
  }, [skills, scopeFilter, agentFilter])

  const toggleSelect = (name: string): void => {
    const next = new Set(selected)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setSelected(next)
  }

  const handleRemove = async (): Promise<void> => {
    if (selected.size === 0) return
    setActionLoading(true)
    const jobId = crypto.randomUUID()
    startJob(jobId)

    try {
      const result = await ipc.remove({
        skills: Array.from(selected),
        cwd: projectDir || undefined
      })
      finishJob(jobId, result)
      if (result.success) {
        setSelected(new Set())
        await refresh()
      }
    } catch (error) {
      finishJob(jobId, {
        success: false,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Remove failed',
        exitCode: 1
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckUpdates = async (): Promise<void> => {
    setActionLoading(true)
    setUpdateStatus(null)
    const jobId = crypto.randomUUID()
    startJob(jobId)

    try {
      const cwd = projectDir || undefined
      const [globalResult, projectResult] = await Promise.all([
        ipc.update({ global: true, cwd }),
        ipc.update({ project: true, cwd })
      ])

      const combinedOutput = [
        globalResult.stdout,
        globalResult.stderr,
        projectResult.stdout,
        projectResult.stderr
      ].join('\n')

      finishJob(jobId, {
        success: globalResult.success && projectResult.success,
        stdout: combinedOutput,
        stderr: '',
        exitCode: globalResult.exitCode === 0 && projectResult.exitCode === 0 ? 0 : 1
      })

      setUpdateStatus(parseUpdateSummary(combinedOutput))
      await refresh()
    } catch (error) {
      finishJob(jobId, {
        success: false,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Update failed',
        exitCode: 1
      })
    } finally {
      setActionLoading(false)
    }
  }

  const statusMessage = ((): string | null => {
    if (!updateStatus) return null
    if (updateStatus.message === 'allUpToDate') return t('installed.allUpToDate')
    if (updateStatus.message === 'updated' && updateStatus.updatedCount > 0) {
      return t('installed.updatedSkills').replace('{count}', String(updateStatus.updatedCount))
    }
    if (updateStatus.message === 'partialFailure') return t('installed.updatePartialFailure')
    return t('installed.updateChecked')
  })()

  return (
    <PageShell
      width="full"
      header={
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-semibold text-text-primary tracking-tight">{t('installed.title')}</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refresh()}
                disabled={loading}
                className="ds-btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <RefreshCw className={clsx('w-4 h-4', loading && 'animate-spin')} />
                {t('installed.refresh')}
              </button>
              <button
                type="button"
                onClick={handleCheckUpdates}
                disabled={actionLoading}
                className="ds-btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <ArrowUpCircle className={clsx('w-4 h-4', actionLoading && 'animate-spin')} />
                {t('installed.checkUpdates')}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={actionLoading || selected.size === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger-soft border border-danger/20 text-danger hover:bg-danger/10 transition-colors text-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {t('installed.removeSelected')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value as 'all' | 'project' | 'global')}
              className="px-3 py-2 rounded-xl ds-input text-sm text-text-secondary"
            >
              <option value="all">{t('installed.allScopes')}</option>
              <option value="project">{t('installed.project')}</option>
              <option value="global">{t('installed.global')}</option>
            </select>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl ds-input text-sm text-text-secondary"
            >
              <option value="">{t('installed.allAgents')}</option>
              {SUPPORTED_AGENTS.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>
        </>
      }
    >
        {statusMessage && (
          <div
            className={clsx(
              'mb-4 px-4 py-3 rounded-2xl text-sm flex items-center gap-2',
              updateStatus?.allUpToDate
                ? 'bg-success-soft border border-success/20 text-success'
                : updateStatus?.failedCount
                  ? 'bg-danger-soft border border-danger/20 text-danger'
                  : 'bg-accent-muted border border-accent/20 text-accent'
            )}
          >
            {updateStatus?.allUpToDate && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-danger-soft border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        {loading && filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-text-muted py-20">{t('installed.noSkills')}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((skill) => (
              <div
                key={`${skill.name}-${skill.scope}-${skill.agent}`}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl ds-card hover:translate-y-0"
              >
                <input
                  type="checkbox"
                  checked={selected.has(skill.name)}
                  onChange={() => toggleSelect(skill.name)}
                  className="w-4 h-4 rounded accent-accent"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{skill.name}</p>
                  <p className="text-xs text-text-muted truncate">
                    {skill.source && `${skill.source} · `}
                    {skill.scope}
                    {skill.agent && ` · ${skill.agent}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
    </PageShell>
  )
}
