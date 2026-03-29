import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

// Graceful: only initialize if API key is set and not placeholder
export const resend = apiKey && !apiKey.startsWith('re_placeholder') 
  ? new Resend(apiKey) 
  : null

export function isResendConfigured(): boolean {
  return resend !== null
}
