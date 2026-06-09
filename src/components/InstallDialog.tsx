import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, X } from 'lucide-react'
import type { RegistrySkill } from '@/types/skills'
import { useI18n } from '@/i18n/I18nProvider'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useJobStore } from '@/stores/useJobStore'
import { ipc } from '@/services/ipc'
import { AgentPicker } from './AgentPicker'
import { ScopeToggle } from './ScopeToggle'

interface InstallDialogProps {
  open: boolean
  skill?: RegistrySkill | null
  onClose: () => void
  onSuccess?: () => void
}

export function InstallDialog({
  open,
  skill,
  onClose,
  onSuccess
}: InstallDialogProps): React.ReactNode {
  const { t } = useI18n()
  const { projectDir, installMethod, setProjectDir } = useSettingsStore()
  const { startJob, finishJob } = useJobStore()

  const [source, setSource] = useState(skill?.source ?? '')
  const [skillsInput, setSkillsInput] = useState(skill?.skillId ?? '')
  const [agents, setAgents] = useState<string[]>(['cursor'])
  const [global, setGlobal] = useState(false)
  const [installProjectDir, setInstallProjectDir] = useState(projectDir)
  const [installAll, setInstallAll] = useState(false)
  const [fullDepth, setFullDepth] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    setSource(skill?.source ?? '')
    setSkillsInput(skill?.skillId ?? '')

    const { projectDir: savedDir } = useSettingsStore.getState()
    if (savedDir) {
      setInstallProjectDir(savedDir)
    } else {
      ipc.getCwd().then((cwd) => {
        setInstallProjectDir(cwd)
        setProjectDir(cwd)
      }).catch(() => {})
    }
  }, [open, skill, setProjectDir])

  const handleBrowse = async (): Promise<void> => {
    const picked = await ipc.pickFolder()
    if (picked) {
      setInstallProjectDir(picked)
      setProjectDir(picked)
    }
  }

  const installDisabled =
    loading || !source.trim() || (!global && !installProjectDir.trim())

  const handleInstall = async (): Promise<void> => {
    if (!source.trim()) return
    setLoading(true)
    const jobId = crypto.randomUUID()
    startJob(jobId)

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const result = await ipc.add({
        source: source.trim(),
        skills: installAll ? ['*'] : skills.length ? skills : undefined,
        agents: agents.length ? agents : undefined,
        global,
        copy: installMethod === 'copy',
        all: installAll,
        fullDepth,
        cwd: global ? undefined : installProjectDir.trim() || undefined
      })
      finishJob(jobId, result)
      if (result.success) {
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      finishJob(jobId, {
        success: false,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Install failed',
        exitCode: 1
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-surface-elevated border border-border shadow-panel overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle ds-topbar">
              <h2 className="text-lg font-semibold text-text-primary">{t('install.title')}</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{t('install.source')}</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="owner/repo or https://github.com/..."
                  className="w-full px-4 py-2.5 ds-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{t('install.skills')}</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder={t('install.skillsPlaceholder')}
                  disabled={installAll}
                  className="w-full px-4 py-2.5 ds-input disabled:opacity-50"
                />
              </div>

              <AgentPicker selected={agents} onChange={setAgents} />
              <ScopeToggle global={global} onChange={setGlobal} />

              {!global && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {t('install.projectFolder')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={installProjectDir}
                      onChange={(e) => setInstallProjectDir(e.target.value)}
                      placeholder={t('install.projectFolderPlaceholder')}
                      className="flex-1 px-4 py-2.5 ds-input"
                    />
                    <button
                      type="button"
                      onClick={handleBrowse}
                      className="ds-btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm shrink-0"
                    >
                      <FolderOpen className="w-4 h-4" />
                      {t('install.browse')}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installAll}
                    onChange={(e) => setInstallAll(e.target.checked)}
                    className="w-4 h-4 rounded accent-accent"
                  />
                  <span className="text-sm text-text-secondary">{t('install.installAll')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fullDepth}
                    onChange={(e) => setFullDepth(e.target.checked)}
                    className="w-4 h-4 rounded accent-accent"
                  />
                  <span className="text-sm text-text-secondary">{t('install.fullDepth')}</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-surface-muted/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {t('install.cancel')}
              </button>
              <button
                type="button"
                onClick={handleInstall}
                disabled={installDisabled}
                className="ds-btn-primary px-5 py-2 text-sm disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('install.confirm')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
