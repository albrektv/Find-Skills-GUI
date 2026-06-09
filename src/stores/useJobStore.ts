import { create } from 'zustand'
import type { CliJobResult } from '@/types/skills'

interface JobLog {
  id: string
  lines: string[]
  status: 'running' | 'success' | 'error'
  result?: CliJobResult
}

interface JobState {
  jobs: JobLog[]
  activeJobId: string | null
  isOpen: boolean
  appendLine: (jobId: string, line: string) => void
  startJob: (jobId: string) => void
  finishJob: (jobId: string, result: CliJobResult) => void
  clearJobs: () => void
  setOpen: (open: boolean) => void
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  activeJobId: null,
  isOpen: false,

  appendLine: (jobId, line) => {
    const jobs = get().jobs.map((job) =>
      job.id === jobId ? { ...job, lines: [...job.lines, line] } : job
    )
    set({ jobs })
  },

  startJob: (jobId) => {
    set({
      activeJobId: jobId,
      isOpen: true,
      jobs: [
        { id: jobId, lines: [], status: 'running' },
        ...get().jobs.slice(0, 9)
      ]
    })
  },

  finishJob: (jobId, result) => {
    const jobs = get().jobs.map((job) =>
      job.id === jobId
        ? {
            ...job,
            status: result.success ? ('success' as const) : ('error' as const),
            result
          }
        : job
    )
    set({ jobs, activeJobId: null })
  },

  clearJobs: () => set({ jobs: [], activeJobId: null }),

  setOpen: (isOpen) => set({ isOpen })
}))
