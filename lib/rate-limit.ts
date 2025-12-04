import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis client for rate limiting
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : undefined

// Rate limiters for different endpoints
// AI Chat: 20 requests per minute (generous for conversations)
export const aiChatLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
      prefix: 'ratelimit:ai:chat',
    })
  : undefined

// AI Generate (document generation): 10 requests per minute
export const aiGenerateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ratelimit:ai:generate',
    })
  : undefined

// AI Upload: 30 requests per minute
export const aiUploadLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: 'ratelimit:ai:upload',
    })
  : undefined

// General API: 100 requests per minute
export const apiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: 'ratelimit:api',
    })
  : undefined

// Expensive operations (delta generation, scope parsing): 5 per minute
export const expensiveOpLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'ratelimit:expensive',
    })
  : undefined

/**
 * Check rate limit and return error response if exceeded
 * @param limiter - The rate limiter to use
 * @param identifier - Unique identifier (usually userId)
 * @returns null if allowed, NextResponse if rate limited
 */
export async function checkRateLimit(
  limiter: Ratelimit | undefined,
  identifier: string
): Promise<NextResponse | null> {
  // If rate limiting is not configured, allow all requests
  if (!limiter) {
    return null
  }

  const { success, limit, reset, remaining } = await limiter.limit(identifier)

  if (!success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please slow down and try again later.',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}

/**
 * Get rate limit headers for successful requests
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  }
}
