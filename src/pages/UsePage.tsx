import { useState } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useJobStore } from '@/stores/useJobStore'
import { ipc } from '@/services/ipc'
import { PageShell } from '@/components/PageShell'
import { SUPPORTED_AGENTS } from '@/types/skills'

export function UsePage(): React.ReactNode {
  const { t } = useI18n()
  const { projectDir } = useSettingsStore()
  const { startJob, finishJob } = useJobStore()

  const [source, setSource] = useState('')
  const [skill, setSkill] = useState('')
  const [agent, setAgent] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (): Promise<void> => {
    if (!source.trim()) return
    setLoading(true)
    const jobId = crypto.randomUUID()
    startJob(jobId)

    try {
      const result = await ipc.use({
        jobId,
        source: source.trim(),
        skill: skill.trim() || undefined,
        agent: agent || undefined,
        cwd: projectDir || undefined
      })
      finishJob(jobId, result)
      setPrompt(result.stdout || result.stderr)
    } catch (error) {
      finishJob(jobId, {
        success: false,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Failed',
        exitCode: 1
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageShell
      width="full"
      header={
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/25 to-accent/10 flex items-center justify-center ring-1 ring-accent/20">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary tracking-tight">{t('use.title')}</h2>
            <p className="text-sm text-text-muted">{t('use.subtitle')}</p>
          </div>
        </div>
      }
    >
      <div className="ds-split-page ds-split-page--stack">
        <div className="ds-split-page-form">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">{t('use.source')}</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={t('use.sourcePlaceholder')}
              className="w-full px-4 py-3 ds-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-0">
            <div className="space-y-2 min-w-0">
              <label className="text-sm font-medium text-text-secondary">{t('use.skill')}</label>
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder={t('use.skillPlaceholder')}
                className="w-full min-w-0 px-4 py-3 ds-input"
              />
            </div>
            <div className="space-y-2 min-w-0">
              <label className="text-sm font-medium text-text-secondary">{t('use.agent')}</label>
              <select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="w-full min-w-0 px-4 py-3 ds-input"
              >
                <option value="">—</option>
                {SUPPORTED_AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !source.trim()}
            className="ds-btn-primary self-start px-6 py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('use.generate')}
          </button>
        </div>

        <div className="ds-split-page-panel ds-card p-6">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="text-sm font-medium text-text-secondary truncate">{t('use.result')}</label>
            {prompt && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-accent hover:bg-accent-muted transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? t('common.copied') : t('use.copy')}
              </button>
            )}
          </div>
          {prompt ? (
            <pre className="flex-1 min-h-0 p-4 rounded-2xl bg-surface-muted border border-border-subtle text-sm text-text-secondary whitespace-pre-wrap font-mono leading-relaxed overflow-y-auto">
              {prompt}
            </pre>
          ) : (
            <p className="flex-1 text-sm text-text-muted leading-relaxed">{t('use.resultHint')}</p>
          )}
        </div>
      </div>
    </PageShell>
  )
}
