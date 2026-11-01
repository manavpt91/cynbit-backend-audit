# Main Document Response Evidence

**Source:** User-supplied DevTools details for `https://www.cynbit.in/`  
**Timestamp shown:** 1 November 2026, 00:21:11 GMT  
**Request:** `GET /`  
**Status:** `304 Not Modified`

## Response details transcribed

- `Server: Vercel`
- `X-Vercel-Cache: HIT`
- `Cache-Control: public, max-age=0, must-revalidate`
- `Date: Sun, 01 Nov 2026 00:21:11 GMT`
- A Vercel request/trace ID was present and is omitted here.
- An `If-None-Match` conditional request header was present; its validator value is omitted.
- The browser showed the effective referrer policy as `strict-origin-when-cross-origin`. This UI field is not evidence that a `Referrer-Policy` response header was sent.

The response header list supplied for this 304 did not show `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Access-Control-Allow-Origin`, or `X-Powered-By`. This is a single 304 response; compare with a fresh 200 response before drawing conclusions about consistent policy across response types.

## Request cookies

The request included Google Analytics cookies named `_ga` and `_ga_LK6CQWCWX0`. Their values have been deliberately omitted. A `Cookie` request header does not reveal the cookies' `HttpOnly`, `Secure`, or `SameSite` attributes; those require the Application cookie view or original `Set-Cookie` response headers.

## Interpretation

`304 Not Modified`, `If-None-Match`, `X-Vercel-Cache: HIT`, and `Cache-Control: public, max-age=0, must-revalidate` together indicate a cache revalidation path for this document. The response confirms Vercel cache participation, but does not provide a transfer size, response time, or Lighthouse TTFB measurement.

