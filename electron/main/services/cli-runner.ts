import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { dirname, join } from 'path'
import type { BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../ipc/channels'
import type {
  AddOptions,
  CliJobResult,
  InitOptions,
  InstalledSkill,
  ListOptions,
  RemoveOptions,
  UpdateOptions,
  UseOptions
} from '../../../src/types/skills'
import { stripAnsi } from '../../../src/lib/cli-output'

const require = createRequire(import.meta.url)

function resolveSkillsCliPath(): string {
  try {
    const pkgPath = require.resolve('skills/package.json')
    return join(dirname(pkgPath), 'bin', 'cli.mjs')
  } catch {
    const fallback = join(process.cwd(), 'node_modules', 'skills', 'bin', 'cli.mjs')
    if (existsSync(fallback)) return fallback
    throw new Error('skills CLI not found. Run npm install first.')
  }
}

function buildEnv(): NodeJS.ProcessEnv {
  const settings = globalThis.__appSettings
  const env = { ...process.env }

  if (settings?.installInternalSkills) {
    env.INSTALL_INTERNAL_SKILLS = '1'
  }
  if (settings?.disableTelemetry) {
    env.DISABLE_TELEMETRY = '1'
    env.DO_NOT_TRACK = '1'
  }

  return env
}

function emitJob(
  window: BrowserWindow | null,
  jobId: string,
  payload: { type: 'stdout' | 'stderr' | 'done'; data?: string; result?: CliJobResult }
): void {
  if (!window || window.isDestroyed()) return
  window.webContents.send(IPC_CHANNELS.JOB_STREAM, { jobId, ...payload })
}

export function runSkillsCli(
  args: string[],
  options: { cwd?: string; jobId?: string; window?: BrowserWindow | null } = {}
): Promise<CliJobResult> {
  const cliPath = resolveSkillsCliPath()
  const jobId = options.jobId ?? crypto.randomUUID()
  const cwd = options.cwd || process.cwd()

  return new Promise((resolve) => {
    let stdout = ''
    let stderr = ''

    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd,
      env: buildEnv(),
      windowsHide: true
    })

    child.stdout.on('data', (chunk: Buffer) => {
      const text = chunk.toString()
      stdout += text
      emitJob(options.window ?? null, jobId, { type: 'stdout', data: text })
    })

    child.stderr.on('data', (chunk: Buffer) => {
      const text = chunk.toString()
      stderr += text
      emitJob(options.window ?? null, jobId, { type: 'stderr', data: text })
    })

    child.on('close', (code) => {
      const result: CliJobResult = {
        success: code === 0,
        stdout,
        stderr,
        exitCode: code
      }
      emitJob(options.window ?? null, jobId, { type: 'done', result })
      resolve(result)
    })

    child.on('error', (error) => {
      const result: CliJobResult = {
        success: false,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        exitCode: null
      }
      emitJob(options.window ?? null, jobId, { type: 'done', result })
      resolve(result)
    })
  })
}

function appendMultiFlag(args: string[], flag: string, values?: string[]): void {
  if (!values?.length) return
  for (const value of values) {
    args.push(flag, value)
  }
}

export async function addSkill(
  options: AddOptions,
  window?: BrowserWindow | null
): Promise<CliJobResult> {
  const args = ['add', options.source]

  if (options.list) args.push('--list')
  if (options.all) args.push('--all')
  if (options.global) args.push('--global')
  if (options.copy) args.push('--copy')
  if (options.fullDepth) args.push('--full-depth')

  appendMultiFlag(args, '--skill', options.skills)
  appendMultiFlag(args, '--agent', options.agents)

  if (!options.list) args.push('-y')

  return runSkillsCli(args, { cwd: options.cwd, window, jobId: options.jobId })
}

export async function removeSkills(
  options: RemoveOptions,
  window?: BrowserWindow | null
): Promise<CliJobResult> {
  const args = ['remove']

  if (options.all) args.push('--all')
  if (options.global) args.push('--global')

  appendMultiFlag(args, '--skill', options.skills)
  appendMultiFlag(args, '--agent', options.agents)

  args.push('-y')

  return runSkillsCli(args, { cwd: options.cwd, window, jobId: options.jobId })
}

export async function updateSkills(
  options: UpdateOptions,
  window?: BrowserWindow | null
): Promise<CliJobResult> {
  const args = ['update']

  if (options.global) args.push('--global')
  if (options.project) args.push('--project')
  if (options.skills?.length) args.push(...options.skills)

  args.push('-y')

  return runSkillsCli(args, { cwd: options.cwd, window, jobId: options.jobId })
}

export async function useSkill(
  options: UseOptions,
  window?: BrowserWindow | null
): Promise<CliJobResult> {
  const source = options.skill ? `${options.source}@${options.skill}` : options.source
  const args = ['use', source]

  if (options.agent) {
    args.push('--agent', options.agent)
  }

  return runSkillsCli(args, { cwd: options.cwd, window, jobId: options.jobId })
}

export async function initSkill(
  options: InitOptions,
  window?: BrowserWindow | null
): Promise<CliJobResult> {
  const args = ['init']
  if (options.name) args.push(options.name)
  return runSkillsCli(args, { cwd: options.cwd, window, jobId: options.jobId })
}

export async function listSkills(
  options: ListOptions,
  window?: BrowserWindow | null
): Promise<{ result: CliJobResult; skills: InstalledSkill[] }> {
  const args = ['list']
  if (options.global) args.push('--global')
  appendMultiFlag(args, '--agent', options.agents)

  const result = await runSkillsCli(args, { cwd: options.cwd, window, jobId: options.jobId })
  const skills = parseInstalledSkills(result.stdout, options.global ? 'global' : 'project')

  return { result, skills }
}

const SKIP_LINE_PATTERNS = [
  /^Global Skills$/i,
  /^Project Skills$/i,
  /^Skills$/i,
  /^No project skills found/i,
  /^No global skills found/i,
  /^Try listing/i
]

function shouldSkipInstalledLine(trimmed: string): boolean {
  if (!trimmed) return true
  if (/^[-─=]{2,}/.test(trimmed)) return true
  return SKIP_LINE_PATTERNS.some((pattern) => pattern.test(trimmed))
}

export function parseInstalledSkills(output: string, defaultScope: 'project' | 'global'): InstalledSkill[] {
  const skills: InstalledSkill[] = []
  const lines = stripAnsi(output).split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (shouldSkipInstalledLine(trimmed)) continue

    const agentMatch = trimmed.match(/\bAgents:\s*(.+)$/i)
    const lineWithoutAgents = agentMatch
      ? trimmed.slice(0, trimmed.length - agentMatch[0].length).trimEnd()
      : trimmed

    const columns = lineWithoutAgents
      .split(/\s{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)

    if (columns.length === 0) continue

    const name = columns[0].replace(/^[-•*]\s*/, '')
    if (!name || /^(skills|installed|global|project|agent)$/i.test(name)) continue

    skills.push({
      name,
      source: columns[1],
      agent: agentMatch?.[1]?.trim(),
      scope: defaultScope
    })
  }

  return skills
}

declare global {
  // eslint-disable-next-line no-var
  var __appSettings: {
    installInternalSkills?: boolean
    disableTelemetry?: boolean
  } | undefined
}
