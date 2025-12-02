import { redis } from './cache'

export interface ActivityEntry {
  timestamp: string
  event: string
  details?: Record<string, any>
}

/**
 * Log an activity event for a project
 */
export async function logActivity(
  projectId: string,
  event: string,
  details?: Record<string, any>
): Promise<void> {
  if (!redis) return

  const entry: ActivityEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
  }

  const key = `activity:project:${projectId}`
  // Push to list, keep last 100 entries
  await redis.lpush(key, JSON.stringify(entry))
  await redis.ltrim(key, 0, 99)
}

/**
 * Get activity log for a project
 */
export async function getActivityLog(
  projectId: string,
  limit = 50
): Promise<ActivityEntry[]> {
  if (!redis) return []

  const key = `activity:project:${projectId}`
  const raw = await redis.lrange(key, 0, limit - 1)

  return raw.map((r) => {
    if (typeof r === 'string') {
      return JSON.parse(r) as ActivityEntry
    }
    return r as ActivityEntry
  })
}
