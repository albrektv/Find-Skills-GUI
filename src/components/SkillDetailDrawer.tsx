import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink } from 'lucide-react'
import type { RegistrySkill, SkillDetail } from '@/types/skills'
import { useI18n } from '@/i18n/I18nProvider'
import { ipc } from '@/services/ipc'
import { extractSkillMdFromUseOutput, parseSkillMd } from '@/lib/skill-md'
import { SkillMarkdown } from '@/components/SkillMarkdown'

interface SkillDetailDrawerProps {
  skill: RegistrySkill | null
  onClose: () => void
  onInstall: (skill: RegistrySkill) => void
}

export function SkillDetailDrawer({
  skill,
  onClose,
  onInstall
}: SkillDetailDrawerProps): React.ReactNode {
  const { t } = useI18n()
  const [detail, setDetail] = useState<SkillDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!skill) {
      setDetail(null)
      setError('')
      return
    }

    const loadDetail = async (): Promise<void> => {
      setLoading(true)
      setError('')
      setDetail(null)

      try {
        const result = await ipc.fetchSkillDetail(skill.id)
        setDetail(result)
      } catch {
        try {
          const fallback = await ipc.use({
            source: skill.source,
            skill: skill.skillId
          })
          const extracted = extractSkillMdFromUseOutput(fallback.stdout)
          if (extracted) {
            setDetail({ skillId: skill.id, ...parseSkillMd(extracted) })
            return
          }
          throw new Error('fallback-empty')
        } catch {
          setError(t('discover.descriptionUnavailable'))
        }
      } finally {
        setLoading(false)
      }
    }

    void loadDetail()
  }, [skill, t])

  return (
    <AnimatePresence>
      {skill && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 end-0 bottom-0 z-50 w-full max-w-xl bg-surface-elevated border-s border-border shadow-panel flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle ds-topbar">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-text-primary truncate">{skill.name}</h2>
                <p className="text-sm text-text-muted truncate">{skill.source}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover shrink-0 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-skill-soft text-skill text-sm font-medium">
                  {skill.installs.toLocaleString()} {t('discover.installs')}
                </span>
                <a
                  href={`https://skills.sh/${skill.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  skills.sh <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {detail?.description && (
                <p className="mb-4 text-sm text-text-muted leading-relaxed border-b border-border-subtle pb-4">
                  {detail.description}
                </p>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="px-4 py-3 rounded-2xl bg-danger-soft border border-danger/20 text-danger text-sm">
                  {error}
                </div>
              ) : detail?.body ? (
                <SkillMarkdown content={detail.body} />
              ) : (
                <p className="text-sm text-text-muted">{t('discover.descriptionUnavailable')}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => onInstall(skill)}
                className="ds-btn-primary w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                {t('discover.install')}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
