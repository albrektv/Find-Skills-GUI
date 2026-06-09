import type { BrowseMode, RegistrySkill, SearchResponse, SkillDetail } from '../../../src/types/skills'
import { parseSkillMd } from '../../../src/lib/skill-md'

const SEARCH_API = 'https://skills.sh/api/search'
const DOWNLOAD_API = 'https://skills.sh/api/download'
const BROWSE_SEED_QUERIES = ['skill', 'agent', 'design'] as const
const BROWSE_CACHE_TTL_MS = 10 * 60 * 1000
const BROWSE_REQUEST_DELAY_MS = 500

interface DownloadFile {
  path: string
  contents: string
}

interface DownloadResponse {
  files: DownloadFile[]
  hash?: string
}

interface BrowseCache {
  pool: RegistrySkill[]
  fetchedAt: number
}

let browseCache: BrowseCache | null = null
let browsePoolPromise: Promise<RegistrySkill[]> | null = null

function parseSkillId(skillId: string): { owner: string; repo: string; slug: string } {
  const segments = skillId.split('/').filter(Boolean)
  if (segments.length < 3) {
    throw new Error(`Invalid skill id: ${skillId}`)
  }

  const slug = segments.pop()!
  const repo = segments.pop()!
  const owner = segments.join('/')
  return { owner, repo, slug }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function sortBrowsePool(pool: RegistrySkill[], mode: BrowseMode, limit: number): RegistrySkill[] {
  if (mode === 'popular') {
    return [...pool].sort((a, b) => b.installs - a.installs).slice(0, limit)
  }

  return pool
    .filter((skill) => skill.installs > 0)
    .sort((a, b) => a.installs - b.installs)
    .slice(0, limit)
}

export async function fetchSkillDetail(skillId: string): Promise<SkillDetail> {
  const { owner, repo, slug } = parseSkillId(skillId)
  const url = `${DOWNLOAD_API}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(slug)}`

  const response = await fetch(url, {
    headers: { Accept: 'application/json' }
  })

  if (!response.ok) {
    throw new Error(`Skill detail fetch failed: ${response.status} ${response.statusText}`)
  }

  const payload = (await response.json()) as DownloadResponse
  const skillFile = payload.files?.find((file) => file.path.toLowerCase() === 'skill.md')

  if (!skillFile?.contents) {
    throw new Error('SKILL.md not found for this skill')
  }

  const parsed = parseSkillMd(skillFile.contents)
  return {
    skillId,
    ...parsed
  }
}

async function searchRegistry(query: string, limit: number): Promise<SearchResponse> {
  const url = new URL(SEARCH_API)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', String(limit))

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Registry search failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as SearchResponse
}

async function searchRegistryWithRetry(
  query: string,
  limit: number,
  retries = 2
): Promise<SearchResponse> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await searchRegistry(query, limit)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      const isRateLimited = message.includes('429')
      if (!isRateLimited || attempt === retries) {
        throw error
      }

      await sleep(1200 * (attempt + 1))
    }
  }

  throw new Error(`Registry search failed for query: ${query}`)
}

async function collectBrowseSkills(limit: number): Promise<RegistrySkill[]> {
  const byId = new Map<string, RegistrySkill>()

  for (let index = 0; index < BROWSE_SEED_QUERIES.length; index++) {
    const seed = BROWSE_SEED_QUERIES[index]
    const response = await searchRegistryWithRetry(seed, limit)

    for (const skill of response.skills) {
      const existing = byId.get(skill.id)
      if (!existing || skill.installs > existing.installs) {
        byId.set(skill.id, skill)
      }
    }

    if (index < BROWSE_SEED_QUERIES.length - 1) {
      await sleep(BROWSE_REQUEST_DELAY_MS)
    }
  }

  return [...byId.values()]
}

async function getBrowsePool(limit: number): Promise<RegistrySkill[]> {
  if (browseCache && Date.now() - browseCache.fetchedAt < BROWSE_CACHE_TTL_MS) {
    return browseCache.pool
  }

  if (!browsePoolPromise) {
    browsePoolPromise = collectBrowseSkills(limit)
      .then((pool) => {
        browseCache = { pool, fetchedAt: Date.now() }
        return pool
      })
      .finally(() => {
        browsePoolPromise = null
      })
  }

  return browsePoolPromise
}

export async function browseSkills(mode: BrowseMode, limit = 100): Promise<SearchResponse> {
  const started = Date.now()
  const pool = await getBrowsePool(limit)
  const skills = sortBrowsePool(pool, mode, limit)

  return {
    query: mode,
    searchType: 'leaderboard',
    skills,
    pool,
    count: skills.length,
    duration_ms: Date.now() - started
  }
}

export async function searchSkills(query: string, limit = 100): Promise<SearchResponse> {
  const trimmed = query.trim()
  if (!trimmed) {
    throw new Error('Search query is required')
  }

  return searchRegistryWithRetry(trimmed, limit)
}
