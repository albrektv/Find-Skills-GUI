import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { PathInputRow } from '@/components/PathInputRow'
import { useI18n } from '@/i18n/I18nProvider'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useJobStore } from '@/stores/useJobStore'
import { ipc } from '@/services/ipc'
import { PageShell } from '@/components/PageShell'

export function CreatePage(): React.ReactNode {
  const { t } = useI18n()
  const { projectDir, setProjectDir } = useSettingsStore()
  const { startJob, finishJob } = useJobStore()

  const [name, setName] = useState('')
  const [folder, setFolder] = useState(projectDir)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBrowse = async (): Promise<void> => {
    const picked = await ipc.pickFolder()
    if (picked) {
      setFolder(picked)
      setProjectDir(picked)
    }
  }

  const handleCreate = async (): Promise<void> => {
    setLoading(true)
    const jobId = crypto.randomUUID()
    startJob(jobId)

    try {
      const result = await ipc.init({
        name: name.trim() || undefined,
        cwd: folder || projectDir || undefined
      })
      finishJob(jobId, result)
      setPreview(result.stdout || result.stderr)
    } catch (error) {
      finishJob(jobId, {
        success: false,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Create failed',
        exitCode: 1
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell
      width="full"
      header={
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/25 to-accent/10 flex items-center justify-center ring-1 ring-accent/20">
            <PlusCircle className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary tracking-tight">{t('create.title')}</h2>
            <p className="text-sm text-text-muted">{t('create.subtitle')}</p>
          </div>
        </div>
      }
    >
      <div className="ds-split-page ds-split-page--stack">
        <div className="ds-split-page-form">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">{t('create.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('create.namePlaceholder')}
              className="w-full px-4 py-3 ds-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">{t('create.folder')}</label>
            <PathInputRow
              value={folder}
              onChange={setFolder}
              onBrowse={handleBrowse}
              browseLabel={t('create.browse')}
            />
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="ds-btn-primary self-start px-6 py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('create.create')}
          </button>
        </div>

        <div className="ds-split-page-panel ds-card p-6">
          <label className="text-sm font-medium text-text-secondary">{t('create.preview')}</label>
          {preview ? (
            <pre className="flex-1 min-h-0 p-4 rounded-2xl bg-surface-muted border border-border-subtle text-sm text-text-secondary whitespace-pre-wrap font-mono leading-relaxed overflow-y-auto">
              {preview}
            </pre>
          ) : (
            <p className="flex-1 text-sm text-text-muted leading-relaxed">{t('create.previewHint')}</p>
          )}
        </div>
      </div>
    </PageShell>
  )
}
