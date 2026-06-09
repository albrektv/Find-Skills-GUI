import { motion } from 'framer-motion'
import { Download, ExternalLink, Copy, Check, FileText } from 'lucide-react'
import { useState } from 'react'
import type { RegistrySkill } from '@/types/skills'
import { useI18n } from '@/i18n/I18nProvider'

interface SkillCardProps {
  skill: RegistrySkill
  index: number
  onInstall: (skill: RegistrySkill) => void
  onView: (skill: RegistrySkill) => void
}

function formatInstalls(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return String(count)
}

export function SkillCard({ skill, index, onInstall, onView }: SkillCardProps): React.ReactNode {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const installCommand = `npx skills add ${skill.source} --skill ${skill.skillId}`

  const handleCopy = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation()
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={() => onView(skill)}
      className="group ds-card p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
            {skill.name}
          </h3>
          <p className="text-xs text-text-muted truncate mt-0.5">{skill.source}</p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-skill-soft text-skill text-xs font-medium">
          {formatInstalls(skill.installs)} {t('discover.installs')}
        </span>
      </div>

      <p className="text-xs text-text-secondary line-clamp-2 mb-4 font-mono bg-surface-muted/60 rounded-lg px-2.5 py-1.5 border border-border-subtle">
        {skill.id}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onInstall(skill)
          }}
          className="ds-btn-primary flex items-center gap-1.5 px-3 py-1.5 text-sm"
        >
          <Download className="w-3.5 h-3.5" />
          {t('discover.install')}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="ds-btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-sm"
          title={t('discover.copyCommand')}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onView(skill)
          }}
          className="ds-btn-secondary flex items-center justify-center p-2 rounded-xl text-sm"
          title={t('discover.viewDescription')}
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
        <a
          href={`https://skills.sh/${skill.id}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ms-auto p-2 rounded-xl text-text-muted hover:text-accent hover:bg-accent-muted transition-colors"
          title={t('discover.viewDetails')}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.article>
  )
}
