/**
 * Simple in-memory rate limiter for Vercel Serverless/Edge
 * Note: This resets on cold starts. For production at scale, use Upstash Redis.
 * 
 * @see https://upstash.com/blog/nextjs-rate-limiting for Redis-based solution
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (resets on cold start - acceptable for MVP)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute
let lastCleanup = Date.now()

function cleanupExpiredEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
  lastCleanup = now
}

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number
  /** Window size in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: number
}

/**
 * Check rate limit for a given identifier (IP, API key, user ID, etc.)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupExpiredEntries()
  
  const now = Date.now()
  const key = identifier
  const entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetAt < now) {
    // New window
    const resetAt = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt,
    }
  }
  
  // Existing window
  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }
  
  entry.count++
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Get client IP from request headers (works with Vercel, Cloudflare, etc.)
 */
export function getClientIP(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP in the chain (client IP)
    return forwardedFor.split(',')[0].trim()
  }
  
  // Vercel-specific
  const vercelIp = headers.get('x-vercel-forwarded-for')
  if (vercelIp) {
    return vercelIp.split(',')[0].trim()
  }
  
  // Cloudflare
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  // Fallback
  return headers.get('x-real-ip') || 'unknown'
}

// Pre-configured rate limiters for common use cases
export const RATE_LIMITS = {
  // Payment endpoints - stricter limits
  payment: { limit: 10, windowMs: 60 * 1000 },        // 10 req/min
  paymentCreate: { limit: 5, windowMs: 60 * 1000 },   // 5 creates/min
  
  // Webhooks - allow burst for Stripe callbacks
  webhook: { limit: 100, windowMs: 60 * 1000 },       // 100 req/min
  
  // API endpoints - standard limits
  api: { limit: 30, windowMs: 60 * 1000 },            // 30 req/min
  
  // Auth endpoints - strict for brute-force protection
  auth: { limit: 5, windowMs: 5 * 60 * 1000 },        // 5 attempts/5min
  register: { limit: 3, windowMs: 60 * 60 * 1000 },   // 3 signups/hour per IP
} as const
