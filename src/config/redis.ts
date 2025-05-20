import { Redis } from '@upstash/redis'

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error('Redis configuration is missing')
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600') // 1 hour in seconds

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    await redis.set(key, data, { ex: CACHE_TTL })
  } catch (error) {
    console.error('Redis set error:', error)
  }
} 