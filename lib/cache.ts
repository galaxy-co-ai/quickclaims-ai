import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : undefined

export function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null
  return await redis.get<T>(key)
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 60 * 60): Promise<void> {
  if (!redis) return
  await redis.set(key, value, { ex: ttlSeconds })
}
