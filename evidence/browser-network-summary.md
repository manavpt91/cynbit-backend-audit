# Browser DevTools Network Evidence

**Evidence file:** `network-fetch-xhr.png`  
**Source:** Screenshot supplied by the user, showing Chrome DevTools Network filtered to Fetch/XHR.  
**Scope visible:** A page load/navigation with Keep log enabled and no throttling. The screenshot does not show the browser address bar or a complete timestamp.

## Visible requests

The first ten rows are requests to same-site Next.js routes with an `_rsc` query parameter, initiated by `1255-eae4096fb21f1304.js:1`. These are consistent with React Server Component/App Router route prefetches, not evidence of ten business API endpoints. The screenshot shows status, size, and duration for each row:

| Visible route/request name | Status | Size shown | Time shown |
|---|---:|---:|---:|
| `story?_rsc=…` | 304 | 0.1 kB | 249 ms |
| `team?_rsc=…` | 304 | 0.1 kB | 243 ms |
| `careers?_rsc=…` | 200 | 0.2 kB | 375 ms |
| `impact?_rsc=…` | 304 | 0.1 kB | 84 ms |
| `services?_rsc=…` | 304 | 0.1 kB | 117 ms |
| `products?_rsc=…` | 304 | 0.1 kB | 108 ms |
| `case-studies?_rsc=…` | 200 | 0.2 kB | 257 ms |
| `bitelevate?_rsc=…` | 304 | 0.1 kB | 61 ms |
| `contact?_rsc=…` | obscured by tooltip | 2.6 kB | 45 ms |
| `ai-agents-business-operations?_rsc=…` | 200 | 0.3 kB | 296 ms |
| Google Analytics `collect?v=2&tid=G-LK6CQWCWX0…` | 204 | 0.0 kB | 106 ms |

The `contact` status cell is covered by a tooltip in the screenshot, so it is intentionally not transcribed. The analytics request was initiated by `js?id=G-LK6CQWCWX0:393`. The exact query values are truncated in the screenshot and are not reproduced.

## Fields not visible in this capture

- Request method and complete URL for every row
- Request payload or response body
- Request/response headers, including CORS and cache headers
- Document timing and TTFB
- Cookie flags or browser storage contents
- Lighthouse metrics
- Any request produced by submitting a form (no submission was performed)

Do not treat the Google Analytics `collect` request or route-prefetch calls as a contact submission. The screenshot records only the visible request metadata above.

