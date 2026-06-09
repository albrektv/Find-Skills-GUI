import { create } from 'zustand'
import type { InstalledSkill } from '@/types/skills'
import { ipc } from '@/services/ipc'
import { useSettingsStore } from './useSettingsStore'

interface InstalledState {
  skills: InstalledSkill[]
  loading: boolean
  error: string | null
  scopeFilter: 'all' | 'project' | 'global'
  agentFilter: string
  setScopeFilter: (scope: 'all' | 'project' | 'global') => void
  setAgentFilter: (agent: string) => void
  refresh: () => Promise<void>
}

export const useInstalledStore = create<InstalledState>((set) => ({
  skills: [],
  loading: false,
  error: null,
  scopeFilter: 'all',
  agentFilter: '',

  setScopeFilter: (scopeFilter) => set({ scopeFilter }),
  setAgentFilter: (agentFilter) => set({ agentFilter }),

  refresh: async () => {
    set({ loading: true, error: null })
    const { projectDir } = useSettingsStore.getState()
    const cwd = projectDir || undefined

    try {
      const [projectResult, globalResult] = await Promise.all([
        ipc.list({ cwd }),
        ipc.list({ global: true, cwd })
      ])

      const combined = [
        ...projectResult.skills.map((s) => ({ ...s, scope: 'project' as const })),
        ...globalResult.skills.map((s) => ({ ...s, scope: 'global' as const }))
      ]

      set({ skills: combined, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load installed skills'
      })
    }
  }
}))
