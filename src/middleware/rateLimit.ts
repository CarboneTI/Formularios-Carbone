import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
})

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')

export async function rateLimit(request: NextRequest) {
  const ip = request.ip || 'anonymous'
  const key = `rate-limit:${ip}`
  
  try {
    const requests = await redis.incr(key)
    
    if (requests === 1) {
      await redis.expire(key, WINDOW_MS / 1000)
    }
    
    if (requests > MAX_REQUESTS) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
    
    return null
  } catch (error) {
    console.error('Rate limiting error:', error)
    return null // Fail open - allow request if rate limiting fails
  }
} 