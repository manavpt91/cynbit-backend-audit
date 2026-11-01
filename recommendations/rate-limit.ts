// Example shared-store limiter for a serverless deployment.
// Install @upstash/ratelimit and @upstash/redis and configure their credentials
// as server-side environment variables before adapting this snippet.
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const inquiryLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'cynbit:contact-inquiry',
  analytics: true,
})

export async function consumeInquiryRateLimit(trustedClientKey: string): Promise<boolean> {
  const result = await inquiryLimiter.limit(trustedClientKey)
  return result.success
}

// Resolve trustedClientKey from the hosting platform's verified client-IP
// metadata. Do not trust arbitrary X-Forwarded-For values from the request.

