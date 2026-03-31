/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress certain warnings in production
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow builds even with type errors for MVP
    ignoreBuildErrors: true,
  },
  
  // Security Headers (OWASP compliant)
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // Clickjacking protection
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // MIME sniffing protection
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Disable unnecessary browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Legacy XSS protection (modern browsers use CSP)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Force HTTPS for 1 year + subdomains
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // DNS prefetch optimization
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Content Security Policy - allows Stripe, self, inline for Next.js
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://api.qrserver.com https://*.stripe.com",
              "font-src 'self'",
              "connect-src 'self' https://api.stripe.com https://r.stripe.com https://m.stripe.network",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
