import { dialog, ipcMain, type BrowserWindow } from 'electron'
import { IPC_CHANNELS } from './channels'
import { browseSkills, searchSkills, fetchSkillDetail } from '../main/services/registry'
import {
  addSkill,
  initSkill,
  listSkills,
  removeSkills,
  updateSkills,
  useSkill
} from '../main/services/cli-runner'
import type {
  AddOptions,
  BrowseMode,
  InitOptions,
  ListOptions,
  RemoveOptions,
  Theme,
  UpdateOptions,
  UseOptions
} from '../../src/types/skills'
import { applyWindowTheme } from '../main/window-theme'

let mainWindow: BrowserWindow | null = null

export function setMainWindow(window: BrowserWindow | null): void {
  mainWindow = window
}

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.BROWSE, async (_event, mode: BrowseMode, limit?: number) => {
    return browseSkills(mode, limit)
  })

  ipcMain.handle(IPC_CHANNELS.SEARCH, async (_event, query: string, limit?: number) => {
    return searchSkills(query, limit)
  })

  ipcMain.handle(IPC_CHANNELS.FETCH_SKILL_DETAIL, async (_event, skillId: string) => {
    return fetchSkillDetail(skillId)
  })

  ipcMain.handle(IPC_CHANNELS.ADD, async (_event, options: AddOptions) => {
    return addSkill(options, mainWindow)
  })

  ipcMain.handle(IPC_CHANNELS.REMOVE, async (_event, options: RemoveOptions) => {
    return removeSkills(options, mainWindow)
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE, async (_event, options: UpdateOptions) => {
    return updateSkills(options, mainWindow)
  })

  ipcMain.handle(IPC_CHANNELS.USE, async (_event, options: UseOptions) => {
    return useSkill(options, mainWindow)
  })

  ipcMain.handle(IPC_CHANNELS.LIST, async (_event, options: ListOptions) => {
    return listSkills(options, mainWindow)
  })

  ipcMain.handle(IPC_CHANNELS.INIT, async (_event, options: InitOptions) => {
    return initSkill(options, mainWindow)
  })

  ipcMain.handle(IPC_CHANNELS.PICK_FOLDER, async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory', 'createDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle(IPC_CHANNELS.GET_CWD, async () => {
    return process.cwd()
  })

  ipcMain.handle(
    IPC_CHANNELS.SET_SETTINGS,
    async (
      _event,
      settings: { installInternalSkills?: boolean; disableTelemetry?: boolean }
    ) => {
      globalThis.__appSettings = settings
    }
  )

  ipcMain.handle(IPC_CHANNELS.SET_THEME, async (_event, theme: Theme) => {
    applyWindowTheme(theme)
  })

  ipcMain.handle(IPC_CHANNELS.GET_PLATFORM, async () => {
    return process.platform
  })
}
