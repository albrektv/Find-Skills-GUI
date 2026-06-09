import { app, BrowserWindow, nativeImage, shell } from 'electron'
import { join } from 'path'
import { APP_WINDOW_HEIGHT, APP_WINDOW_WIDTH } from '../../src/lib/app-layout'
import { registerIpcHandlers, setMainWindow } from '../ipc/handlers'
import { resolveAppIconPath } from './app-icon'
import {
  initialWindowChrome,
  registerNativeThemeListener,
  setMainWindowForTheme,
  usesCustomTitleBar
} from './window-theme'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const chrome = initialWindowChrome()
  const customTitleBar = usesCustomTitleBar()
  const iconPath = resolveAppIconPath()
  const icon = iconPath ? nativeImage.createFromPath(iconPath) : undefined

  mainWindow = new BrowserWindow({
    width: APP_WINDOW_WIDTH,
    height: APP_WINDOW_HEIGHT,
    minWidth: APP_WINDOW_WIDTH,
    maxWidth: APP_WINDOW_WIDTH,
    minHeight: APP_WINDOW_HEIGHT,
    maxHeight: APP_WINDOW_HEIGHT,
    resizable: false,
    maximizable: false,
    show: false,
    title: 'Find Skills',
    backgroundColor: chrome.background,
    autoHideMenuBar: true,
    ...(icon && !icon.isEmpty() ? { icon } : {}),
    ...(customTitleBar
      ? {
          titleBarStyle: 'hidden' as const,
          titleBarOverlay: {
            color: chrome.overlay,
            symbolColor: chrome.symbol,
            height: 40
          }
        }
      : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  setMainWindow(mainWindow)
  setMainWindowForTheme(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    if (process.env.NODE_ENV_ELECTRON_VITE === 'development') {
      mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    setMainWindow(null)
    setMainWindowForTheme(null)
    mainWindow = null
  })
}

app.whenReady().then(() => {
  const iconPath = resolveAppIconPath()
  const icon = iconPath ? nativeImage.createFromPath(iconPath) : undefined
  if (process.platform === 'darwin' && icon && !icon.isEmpty()) {
    app.dock?.setIcon(icon)
  }

  registerNativeThemeListener()
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
