import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X, Trash2 } from 'lucide-react'
import { useJobStore } from '@/stores/useJobStore'
import { useI18n } from '@/i18n/I18nProvider'
import clsx from 'clsx'

export function LogConsole(): React.ReactNode {
  const { t } = useI18n()
  const { jobs, isOpen, setOpen, clearJobs, activeJobId } = useJobStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeJob = jobs.find((j) => j.id === activeJobId) ?? jobs[0]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeJob?.lines.length])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        className={clsx(
          'fixed bottom-6 end-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all shadow-panel',
          isOpen
            ? 'ds-btn-primary border border-accent'
            : 'ds-chip text-text-secondary hover:text-text-primary'
        )}
      >
        <Terminal className="w-4 h-4" />
        <span className="text-sm font-medium">{t('common.console')}</span>
        {activeJob?.status === 'running' && (
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 end-6 z-40 w-[480px] max-h-[320px] flex flex-col rounded-2xl border border-border bg-surface-elevated shadow-panel overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle ds-topbar">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-text-primary">{t('common.console')}</span>
                {activeJob && (
                  <span
                    className={clsx(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      activeJob.status === 'running' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                      activeJob.status === 'success' && 'bg-success-soft text-success',
                      activeJob.status === 'error' && 'bg-danger-soft text-danger'
                    )}
                  >
                    {activeJob.status}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearJobs}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                  title={t('common.clear')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex-1 overflow-auto p-3 font-mono text-xs text-text-secondary leading-relaxed bg-surface-muted/50"
            >
              {activeJob?.lines.length ? (
                activeJob.lines.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap break-all">
                    {line}
                  </div>
                ))
              ) : (
                <span className="text-text-muted">Waiting for output...</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
