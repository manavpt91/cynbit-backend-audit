# Earlier Passive Response Snapshot

This is supplemental evidence from individual public HTTPS GET requests made before the browser screenshot was supplied. It is not a Chrome DevTools capture and was not part of the screenshot evidence. Observations were taken on 1 November 2026 around 00:09 UTC.

| Page | Status | Retrieved body size | Cache-Control |
|---|---:|---:|---|
| `/` | 200 | 100,498 bytes | `public, max-age=0, must-revalidate` |
| `/contact` | 200 | 64,026 bytes | Not present in captured response |
| `/careers` | 200 | 125,485 bytes | `private, no-cache, no-store, max-age=0, must-revalidate` |

All three sampled responses included `Strict-Transport-Security: max-age=63072000`. The sampled responses did not include Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, or Permissions-Policy. The root response identified `Vercel`; `/contact` and `/careers` exposed `x-powered-by: Next.js`.

These are single snapshots, not a full header audit or performance benchmark. Retrieved body sizes are not compressed transfer sizes. Absence of a header in these samples is a hardening opportunity, not evidence of an exploitable vulnerability.

