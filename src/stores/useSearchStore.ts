import { create } from 'zustand'
import type { BrowseMode, RegistrySkill } from '@/types/skills'
import { ipc } from '@/services/ipc'

function sortBrowsePool(pool: RegistrySkill[], mode: BrowseMode, limit = 100): RegistrySkill[] {
  if (mode === 'popular') {
    return [...pool].sort((a, b) => b.installs - a.installs).slice(0, limit)
  }

  return pool
    .filter((skill) => skill.installs > 0)
    .sort((a, b) => a.installs - b.installs)
    .slice(0, limit)
}

interface SearchState {
  query: string
  browseMode: BrowseMode
  browsePool: RegistrySkill[]
  skills: RegistrySkill[]
  loading: boolean
  browseLoading: boolean
  error: string | null
  selectedSkill: RegistrySkill | null
  setQuery: (query: string) => void
  setBrowseMode: (mode: BrowseMode) => void
  setSelectedSkill: (skill: RegistrySkill | null) => void
  loadBrowse: (mode?: BrowseMode) => Promise<void>
  search: (query?: string) => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  browseMode: 'popular',
  browsePool: [],
  skills: [],
  loading: false,
  browseLoading: false,
  error: null,
  selectedSkill: null,

  setQuery: (query) => set({ query }),

  setBrowseMode: (browseMode) => {
    const pool = get().browsePool
    if (pool.length > 0) {
      set({
        browseMode,
        skills: sortBrowsePool(pool, browseMode)
      })
      return
    }

    set({ browseMode })
  },

  setSelectedSkill: (selectedSkill) => set({ selectedSkill }),

  loadBrowse: async (mode) => {
    const browseMode = mode ?? get().browseMode
    const cachedPool = get().browsePool

    if (cachedPool.length > 0) {
      set({
        browseMode,
        query: '',
        error: null,
        skills: sortBrowsePool(cachedPool, browseMode)
      })
      return
    }

    if (get().browseLoading) {
      set({ browseMode, query: '' })
      return
    }

    set({ browseLoading: true, loading: true, error: null, browseMode, query: '' })

    try {
      const response = await ipc.browse(browseMode, 100)
      const pool = response.pool ?? response.skills

      set({
        browsePool: pool,
        skills: sortBrowsePool(pool, browseMode),
        browseLoading: false,
        loading: false
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load skills'
      set({
        browseLoading: false,
        loading: false,
        error: message.includes('429') ? 'RATE_LIMITED' : message
      })
    }
  },

  search: async (query) => {
    const q = (query ?? get().query).trim()
    if (!q) {
      return get().loadBrowse()
    }

    set({ loading: true, error: null })

    try {
      const response = await ipc.search(q, 100)
      set({ skills: response.skills, loading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Search failed'
      set({
        loading: false,
        error: message.includes('429') ? 'RATE_LIMITED' : message
      })
    }
  }
}))
