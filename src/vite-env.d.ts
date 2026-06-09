/// <reference types="vite/client" />

import type { SkillsApi } from '../electron/preload/index'

declare global {
  interface Window {
    skillsApi: SkillsApi
  }
}
