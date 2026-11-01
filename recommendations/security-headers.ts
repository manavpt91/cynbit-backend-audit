// Illustrative next.config.ts fragment. Start CSP in report-only mode, review
// reports, and tailor source lists to the site's actual scripts and assets.
import type { NextConfig } from 'next'

const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'report-sample'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },
}

export default nextConfig

