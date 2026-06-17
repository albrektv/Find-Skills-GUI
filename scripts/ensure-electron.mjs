import { downloadArtifact } from '@electron/get'
import extract from 'extract-zip'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const electronDir = path.join(root, 'node_modules', 'electron')
const packageJsonPath = path.join(electronDir, 'package.json')

if (!fs.existsSync(packageJsonPath)) {
  process.exit(0)
}

const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const distPath = path.join(electronDir, 'dist')
const electronExe = path.join(distPath, 'electron.exe')
const pathFile = path.join(electronDir, 'path.txt')

if (fs.existsSync(electronExe) && fs.existsSync(pathFile)) {
  process.exit(0)
}

console.log(`Ensuring Electron ${version} binary is installed...`)

fs.rmSync(distPath, { recursive: true, force: true })
fs.mkdirSync(distPath, { recursive: true })

const zipPath = await downloadArtifact({
  version,
  artifactName: 'electron',
  platform: process.platform,
  arch: process.arch
})

console.log(`Extracting ${zipPath}`)

if (process.platform === 'win32') {
  const result = spawnSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      `Expand-Archive -Path '${zipPath.replace(/'/g, "''")}' -DestinationPath '${distPath.replace(/'/g, "''")}' -Force`
    ],
    { stdio: 'inherit' }
  )
  if (result.status !== 0) {
    console.error('Failed to extract Electron archive')
    process.exit(result.status ?? 1)
  }
} else {
  await extract(zipPath, { dir: distPath })
}

await fs.promises.writeFile(pathFile, process.platform === 'win32' ? 'electron.exe' : 'electron')

if (!fs.existsSync(electronExe) && process.platform !== 'win32') {
  const linuxBin = path.join(distPath, 'electron')
  if (!fs.existsSync(linuxBin)) {
    console.error('Electron binary not found after extract')
    process.exit(1)
  }
} else if (!fs.existsSync(electronExe) && process.platform === 'win32') {
  console.error('electron.exe not found after extract')
  process.exit(1)
}

console.log('Electron binary ready.')
