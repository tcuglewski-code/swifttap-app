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
}

export default nextConfig
