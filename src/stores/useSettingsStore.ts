import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings, InstallMethod, Language, Theme } from '@/types/skills'

interface SettingsState extends AppSettings {
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  setProjectDir: (dir: string) => void
  setInstallMethod: (method: InstallMethod) => void
  setInstallInternalSkills: (value: boolean) => void
  setDisableTelemetry: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      projectDir: '',
      installMethod: 'symlink',
      installInternalSkills: false,
      disableTelemetry: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setProjectDir: (projectDir) => set({ projectDir }),
      setInstallMethod: (installMethod) => set({ installMethod }),
      setInstallInternalSkills: (installInternalSkills) => set({ installInternalSkills }),
      setDisableTelemetry: (disableTelemetry) => set({ disableTelemetry })
    }),
    { name: 'find-skills-settings' }
  )
)
