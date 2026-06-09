import { app } from 'electron'
import { existsSync } from 'fs'
import { join } from 'path'

export function resolveAppIconPath(): string | undefined {
  const candidates = [
    join(process.resourcesPath, 'icon.png'),
    join(app.getAppPath(), 'Res', 'icon.png'),
    join(__dirname, '../../Res/icon.png')
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }

  return undefined
}
