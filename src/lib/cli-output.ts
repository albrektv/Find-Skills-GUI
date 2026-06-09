const ANSI_PATTERN = /\u001B(?:\[[0-9;]*m|\][^\u001B]*(?:\u001B\\|$))/g

export function stripAnsi(text: string): string {
  return text.replace(ANSI_PATTERN, '')
}

export interface UpdateSummary {
  allUpToDate: boolean
  updatedCount: number
  failedCount: number
  message: string
}

export function parseUpdateSummary(output: string): UpdateSummary {
  const text = stripAnsi(output)
  const allUpToDate =
    /All (global )?skills are up to date/i.test(text) ||
    /All skills are up to date/i.test(text)

  const updatedCount = (text.match(/Updated \S+/gi) ?? []).length
  const failedCount = (text.match(/Failed to update \S+/gi) ?? []).length
  const foundMatch = text.match(/Found (\d+) global update\(s\)/i)
  const pendingUpdates = foundMatch ? Number(foundMatch[1]) : 0

  if (allUpToDate && updatedCount === 0 && failedCount === 0) {
    return {
      allUpToDate: true,
      updatedCount: 0,
      failedCount: 0,
      message: 'allUpToDate'
    }
  }

  if (updatedCount > 0 && failedCount === 0) {
    return {
      allUpToDate: false,
      updatedCount,
      failedCount: 0,
      message: 'updated'
    }
  }

  if (failedCount > 0) {
    return {
      allUpToDate: false,
      updatedCount,
      failedCount,
      message: 'partialFailure'
    }
  }

  if (pendingUpdates > 0) {
    return {
      allUpToDate: false,
      updatedCount: pendingUpdates,
      failedCount: 0,
      message: 'updated'
    }
  }

  return {
    allUpToDate,
    updatedCount,
    failedCount,
    message: allUpToDate ? 'allUpToDate' : 'checked'
  }
}
