import { nativeTheme, type BrowserWindow } from 'electron'
import type { Theme } from '../../src/types/skills'

const WINDOW_CHROME = {
  light: {
    background: '#f5f7fa',
    overlay: '#f5f7fa',
    symbol: '#222222'
  },
  dark: {
    background: '#101010',
    overlay: '#101010',
    symbol: '#ffffff'
  }
} as const

export type ResolvedWindowTheme = keyof typeof WINDOW_CHROME

let themePreference: Theme = 'light'
let mainWindowRef: BrowserWindow | null = null

export function setMainWindowForTheme(window: BrowserWindow | null): void {
  mainWindowRef = window
}

export function resolveWindowTheme(pref: Theme): ResolvedWindowTheme {
  if (pref === 'dark') return 'dark'
  if (pref === 'light') return 'light'
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
}

export function applyWindowTheme(pref: Theme): void {
  themePreference = pref
  nativeTheme.themeSource = pref
  applyWindowChrome(resolveWindowTheme(pref))
}

export function applyWindowChrome(mode: ResolvedWindowTheme): void {
  const chrome = WINDOW_CHROME[mode]
  const window = mainWindowRef

  if (!window || window.isDestroyed()) return

  window.setBackgroundColor(chrome.background)

  if (process.platform === 'win32') {
    window.setTitleBarOverlay({
      color: chrome.overlay,
      symbolColor: chrome.symbol,
      height: 40
    })
  }
}

export function registerNativeThemeListener(): void {
  nativeTheme.on('updated', () => {
    if (themePreference === 'system') {
      applyWindowChrome(resolveWindowTheme('system'))
    }
  })
}

export function initialWindowChrome(): (typeof WINDOW_CHROME)[ResolvedWindowTheme] {
  return WINDOW_CHROME[resolveWindowTheme(themePreference)]
}

export function usesCustomTitleBar(): boolean {
  return process.platform === 'win32' || process.platform === 'linux'
}
