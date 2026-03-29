// ============================================================================
// Zipayo API Key Generator
// Generates secure API keys with 32+ characters and "st_" prefix
// ============================================================================

import crypto from 'crypto'

/**
 * Generates a secure API key with the format: st_<random>
 * Minimum 32 characters (prefix + 29 random chars = 32 total)
 */
export function generateApiKey(): string {
  // Generate 32 random bytes and convert to base64url
  const randomBytes = crypto.randomBytes(32)
  const base64 = randomBytes.toString('base64url')
  
  // Ensure at least 32 total characters
  const key = `st_${base64}`
  
  return key // ~46 characters total (st_ + 43 base64url chars)
}

/**
 * Generates a short API key for display purposes
 * Format: st_****...****
 */
export function maskApiKey(key: string): string {
  if (key.length < 12) {
    return '****'
  }
  
  const prefix = key.slice(0, 6)  // "st_xxx"
  const suffix = key.slice(-4)     // last 4 chars
  
  return `${prefix}...${suffix}`
}

/**
 * Hashes an API key for secure storage
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Validates API key format
 */
export function isValidApiKeyFormat(key: string): boolean {
  // Must start with st_
  if (!key.startsWith('st_')) {
    return false
  }
  
  // Must be at least 32 characters
  if (key.length < 32) {
    return false
  }
  
  // Only alphanumeric, underscore, and base64url chars
  const validChars = /^st_[A-Za-z0-9_-]+$/
  return validChars.test(key)
}

/**
 * Generates a unique key ID for reference
 */
export function generateKeyId(): string {
  return `key_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
}
