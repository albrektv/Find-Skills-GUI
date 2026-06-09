export interface RegistrySkill {
  id: string
  skillId: string
  name: string
  installs: number
  source: string
}

export interface SkillDetail {
  skillId: string
  name?: string
  description?: string
  body: string
  raw: string
}

export type BrowseMode = 'popular' | 'new'

export interface SearchResponse {
  query: string
  searchType: string
  skills: RegistrySkill[]
  pool?: RegistrySkill[]
  count: number
  duration_ms?: number
}

export interface InstalledSkill {
  name: string
  source?: string
  agent?: string
  scope: 'project' | 'global'
  path?: string
}

export interface CliJobResult {
  success: boolean
  stdout: string
  stderr: string
  exitCode: number | null
}

export interface AddOptions {
  source: string
  skills?: string[]
  agents?: string[]
  global?: boolean
  copy?: boolean
  all?: boolean
  fullDepth?: boolean
  list?: boolean
  cwd?: string
}

export interface RemoveOptions {
  skills?: string[]
  agents?: string[]
  global?: boolean
  all?: boolean
  cwd?: string
}

export interface UpdateOptions {
  skills?: string[]
  global?: boolean
  project?: boolean
  cwd?: string
}

export interface UseOptions {
  source: string
  skill?: string
  agent?: string
  cwd?: string
}

export interface InitOptions {
  name?: string
  cwd?: string
}

export interface ListOptions {
  global?: boolean
  agents?: string[]
  cwd?: string
}

export interface JobStreamEvent {
  jobId: string
  type: 'stdout' | 'stderr' | 'done'
  data?: string
  result?: CliJobResult
}

export type InstallMethod = 'symlink' | 'copy'
export type Theme = 'system' | 'dark' | 'light'
export type Language = 'en' | 'ar'

export interface AppSettings {
  theme: Theme
  language: Language
  projectDir: string
  installMethod: InstallMethod
  installInternalSkills: boolean
  disableTelemetry: boolean
}

export const SUPPORTED_AGENTS = [
  'cursor',
  'claude-code',
  'codex',
  'opencode',
  'github-copilot',
  'windsurf',
  'cline',
  'zed',
  'gemini-cli',
  'roo',
  'continue',
  'amp',
  'replit',
  'universal'
] as const

export type SupportedAgent = (typeof SUPPORTED_AGENTS)[number]
