import type {
  AddOptions,
  BrowseMode,
  CliJobResult,
  InitOptions,
  InstalledSkill,
  JobStreamEvent,
  ListOptions,
  RemoveOptions,
  SearchResponse,
  SkillDetail,
  UpdateOptions,
  UseOptions
} from '@/types/skills'
import type { SkillsApi } from '../../electron/preload/index'

function getApi(): SkillsApi | null {
  return window.skillsApi ?? null
}

const unavailable = (): Promise<never> =>
  Promise.reject(new Error('skillsApi is not available. Run inside Electron.'))

export const ipc = {
  browse: (mode: BrowseMode, limit?: number): Promise<SearchResponse> =>
    getApi()?.browse(mode, limit) ?? unavailable(),

  search: (query: string, limit?: number): Promise<SearchResponse> =>
    getApi()?.search(query, limit) ?? unavailable(),

  fetchSkillDetail: (skillId: string): Promise<SkillDetail> =>
    getApi()?.fetchSkillDetail(skillId) ?? unavailable(),

  add: (options: AddOptions): Promise<CliJobResult> =>
    getApi()?.add(options) ?? unavailable(),

  remove: (options: RemoveOptions): Promise<CliJobResult> =>
    getApi()?.remove(options) ?? unavailable(),

  update: (options: UpdateOptions): Promise<CliJobResult> =>
    getApi()?.update(options) ?? unavailable(),

  use: (options: UseOptions): Promise<CliJobResult> =>
    getApi()?.use(options) ?? unavailable(),

  list: (
    options: ListOptions
  ): Promise<{ result: CliJobResult; skills: InstalledSkill[] }> =>
    getApi()?.list(options) ?? unavailable(),

  init: (options: InitOptions): Promise<CliJobResult> =>
    getApi()?.init(options) ?? unavailable(),

  pickFolder: (): Promise<string | null> => getApi()?.pickFolder() ?? unavailable(),

  getCwd: (): Promise<string> => getApi()?.getCwd() ?? unavailable(),

  setSettings: (settings: {
    installInternalSkills?: boolean
    disableTelemetry?: boolean
  }): Promise<void> => getApi()?.setSettings(settings) ?? Promise.resolve(),

  setTheme: (theme: import('@/types/skills').Theme): Promise<void> =>
    getApi()?.setTheme(theme) ?? Promise.resolve(),

  getPlatform: (): Promise<NodeJS.Platform> =>
    getApi()?.getPlatform() ?? Promise.resolve('darwin' as NodeJS.Platform),

  minimizeWindow: (): Promise<void> => getApi()?.minimizeWindow() ?? Promise.resolve(),

  closeWindow: (): Promise<void> => getApi()?.closeWindow() ?? Promise.resolve(),

  onJobStream: (callback: (event: JobStreamEvent) => void): (() => void) =>
    getApi()?.onJobStream(callback) ?? (() => {})
}
