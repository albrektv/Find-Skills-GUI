export interface ParsedSkillMd {
  name?: string
  description?: string
  body: string
  raw: string
}

export function parseSkillMd(content: string): ParsedSkillMd {
  const raw = content.trim()
  if (!raw.startsWith('---')) {
    return { body: raw, raw }
  }

  const end = raw.indexOf('---', 3)
  if (end === -1) {
    return { body: raw, raw }
  }

  const frontmatter = raw.slice(3, end).trim()
  const body = raw.slice(end + 3).trim()
  const fields: Record<string, string> = {}

  for (const line of frontmatter.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue
    const [, key, value] = match
    fields[key] = value.replace(/^["']|["']$/g, '').trim()
  }

  return {
    name: fields.name,
    description: fields.description,
    body,
    raw
  }
}

export function extractSkillMdFromUseOutput(output: string): string | null {
  const match = output.match(/<SKILL\.md>\n([\s\S]*?)\n<\/SKILL\.md>/)
  return match?.[1]?.trim() ?? null
}
