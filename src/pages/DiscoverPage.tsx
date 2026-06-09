import { useEffect, useCallback, useState } from 'react'
import { Flame, Sparkles } from 'lucide-react'
import { useSearchStore } from '@/stores/useSearchStore'
import { useI18n } from '@/i18n/I18nProvider'
import type { BrowseMode } from '@/types/skills'
import { SearchBar } from '@/components/SearchBar'
import { SkillCard } from '@/components/SkillCard'
import { SkillDetailDrawer } from '@/components/SkillDetailDrawer'
import { InstallDialog } from '@/components/InstallDialog'
import { PageShell } from '@/components/PageShell'
import type { RegistrySkill } from '@/types/skills'

export function DiscoverPage(): React.ReactNode {
  const { t } = useI18n()
  const {
    query,
    browseMode,
    skills,
    loading,
    error,
    setQuery,
    setBrowseMode,
    setSelectedSkill,
    selectedSkill,
    loadBrowse,
    search
  } = useSearchStore()

  const [installSkill, setInstallSkill] = useState<RegistrySkill | null>(null)
  const [installOpen, setInstallOpen] = useState(false)

  useEffect(() => {
    loadBrowse()
  }, [loadBrowse])

  const handleSearch = useCallback(() => {
    search(query)
  }, [search, query])

  const handleBrowseChange = useCallback(
    (mode: BrowseMode) => {
      if (mode === browseMode) return
      setBrowseMode(mode)
    },
    [browseMode, setBrowseMode]
  )

  const sectionTitle = query
    ? t('discover.results')
    : browseMode === 'popular'
      ? t('discover.popular')
      : t('discover.new')

  const handleInstall = (skill: RegistrySkill): void => {
    setInstallSkill(skill)
    setInstallOpen(true)
  }

  return (
    <>
      <PageShell
        width="full"
        header={
          <div className="flex items-center gap-4 w-full">
            <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} loading={loading} />
            <button
              type="button"
              onClick={handleSearch}
              className="ds-btn-primary px-5 py-3 text-sm font-medium shrink-0"
            >
              {t('discover.results')}
            </button>
          </div>
        }
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="ds-section-label">{sectionTitle}</h2>

          {!query && (
            <div className="ds-segment shrink-0" role="tablist" aria-label={t('discover.browseFilter')}>
              <button
                type="button"
                role="tab"
                aria-selected={browseMode === 'popular'}
                onClick={() => handleBrowseChange('popular')}
                className={`ds-segment-btn ${browseMode === 'popular' ? 'ds-segment-btn-active' : ''}`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{t('discover.tabPopular')}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={browseMode === 'new'}
                onClick={() => handleBrowseChange('new')}
                className={`ds-segment-btn ${browseMode === 'new' ? 'ds-segment-btn-active' : ''}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('discover.tabNew')}</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-danger-soft border border-danger/20 text-danger text-sm">
            {error === 'RATE_LIMITED' ? t('discover.rateLimited') : error}
          </div>
        )}

        {loading && skills.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-muted">{t('discover.loading')}</p>
            </div>
          </div>
        ) : skills.length === 0 ? (
          <p className="text-center text-text-muted py-20">{t('discover.noResults')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={index}
                onInstall={handleInstall}
                onView={setSelectedSkill}
              />
            ))}
          </div>
        )}
      </PageShell>

      <SkillDetailDrawer
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onInstall={(skill) => {
          setSelectedSkill(null)
          handleInstall(skill)
        }}
      />

      <InstallDialog
        open={installOpen}
        skill={installSkill}
        onClose={() => {
          setInstallOpen(false)
          setInstallSkill(null)
        }}
      />
    </>
  )
}
