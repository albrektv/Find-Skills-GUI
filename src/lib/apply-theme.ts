import type { Theme } from '@/types/skills'

export type ResolvedTheme = 'light' | 'dark'

let removeSystemListener: (() => void) | null = null

function resolvedMode(pref: Theme): ResolvedTheme {
  if (pref === 'dark') return 'dark'
  if (pref === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

async function syncNativeWindowTheme(pref: Theme): Promise<void> {
  if (typeof window === 'undefined' || !window.skillsApi?.setTheme) return
  try {
    await window.skillsApi.setTheme(pref)
  } catch {
    // Browser preview / non-Electron dev without preload
  }
}

export function applyTheme(pref: Theme): void {
  removeSystemListener?.()
  removeSystemListener = null

  const root = document.documentElement
  const apply = (): void => {
    const mode = resolvedMode(pref)
    root.classList.toggle('dark', mode === 'dark')
    root.classList.toggle('light', mode === 'light')
    root.setAttribute('data-theme', mode)
    void syncNativeWindowTheme(pref)
  }

  if (pref === 'system') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (): void => {
      apply()
    }
    mq.addEventListener('change', onChange)
    removeSystemListener = (): void => {
      mq.removeEventListener('change', onChange)
    }
  }

  apply()
}

export function getResolvedTheme(pref: Theme): ResolvedTheme {
  return resolvedMode(pref)
}
