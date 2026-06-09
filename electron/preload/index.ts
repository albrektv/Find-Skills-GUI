import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../ipc/channels'
import type {
  AddOptions,
  BrowseMode,
  CliJobResult,
  InitOptions,
  ListOptions,
  RemoveOptions,
  SearchResponse,
  SkillDetail,
  Theme,
  UpdateOptions,
  UseOptions
} from '../../src/types/skills'
import type { InstalledSkill } from '../../src/types/skills'
import type { JobStreamEvent } from '../../src/types/skills'

const skillsApi = {
  platform: process.platform,

  browse: (mode: BrowseMode, limit?: number): Promise<SearchResponse> =>
    ipcRenderer.invoke(IPC_CHANNELS.BROWSE, mode, limit),

  search: (query: string, limit?: number): Promise<SearchResponse> =>
    ipcRenderer.invoke(IPC_CHANNELS.SEARCH, query, limit),

  fetchSkillDetail: (skillId: string): Promise<SkillDetail> =>
    ipcRenderer.invoke(IPC_CHANNELS.FETCH_SKILL_DETAIL, skillId),

  add: (options: AddOptions): Promise<CliJobResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD, options),

  remove: (options: RemoveOptions): Promise<CliJobResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.REMOVE, options),

  update: (options: UpdateOptions): Promise<CliJobResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE, options),

  use: (options: UseOptions): Promise<CliJobResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.USE, options),

  list: (
    options: ListOptions
  ): Promise<{ result: CliJobResult; skills: InstalledSkill[] }> =>
    ipcRenderer.invoke(IPC_CHANNELS.LIST, options),

  init: (options: InitOptions): Promise<CliJobResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.INIT, options),

  pickFolder: (): Promise<string | null> => ipcRenderer.invoke(IPC_CHANNELS.PICK_FOLDER),

  getCwd: (): Promise<string> => ipcRenderer.invoke(IPC_CHANNELS.GET_CWD),

  setSettings: (settings: {
    installInternalSkills?: boolean
    disableTelemetry?: boolean
  }): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.SET_SETTINGS, settings),

  setTheme: (theme: Theme): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.SET_THEME, theme),

  getPlatform: (): Promise<NodeJS.Platform> => ipcRenderer.invoke(IPC_CHANNELS.GET_PLATFORM),

  onJobStream: (callback: (event: JobStreamEvent) => void): (() => void) => {
    const handler = (_: Electron.IpcRendererEvent, event: JobStreamEvent): void => {
      callback(event)
    }
    ipcRenderer.on(IPC_CHANNELS.JOB_STREAM, handler)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.JOB_STREAM, handler)
  }
}

contextBridge.exposeInMainWorld('skillsApi', skillsApi)

export type SkillsApi = typeof skillsApi
