# Cynbit Backend Technical Audit

**Prepared:** 1 November 2026  
**Target:** [https://www.cynbit.in](https://www.cynbit.in)  
**Assessment type:** Passive review of public pages and user-supplied DevTools evidence

## Executive summary

Cynbit's public marketing site is served through Vercel and uses Next.js App Router assets. The supplied Chrome DevTools screenshot shows ten same-site `?_rsc=` fetches that are consistent with route prefetching, plus a Google Analytics collection request. It does not show a conventional business API call or form submission. The screenshot gives visible status, size, and time values for most rows; it does not show request methods, full URLs, headers, bodies, or Lighthouse results.

Earlier passive 200 response snapshots showed HSTS on sampled pages but did not show CSP, `X-Content-Type-Options`, or frame protections. The newly supplied 304 header list did not include HSTS or those other headers. This difference needs a fresh 200 header capture before claiming the policy is inconsistent. These are defense-in-depth opportunities, not proof of an exploitable vulnerability. The contact form appears to use a Next.js Server Action named `submitInquiry`; whether that action validates input or applies rate limits cannot be established without invoking it or reviewing source code. The assessment email restricts testing to passive and authorized activity, so no form was submitted.

No confirmed exploitable backend vulnerability was established. The prioritized findings and fixes are in [FINDINGS.md](FINDINGS.md).

## Scope and methodology

The assessment used a small number of ordinary HTTPS `GET` requests to public pages and technical files, public page HTML and browser-delivered JavaScript, and a Chrome DevTools screenshot supplied by the user. The screenshot showed the Network panel filtered to Fetch/XHR, Keep log enabled, and No throttling selected. The screenshot itself has no visible address bar or complete timestamp.

No form was submitted, no authentication or hidden paths were tested, and no fuzzing, load testing, exploitation, or scanning was performed. The scope follows the assessment email's passive/authorized testing restriction.

Evidence sources are kept distinct:

- `evidence/network-fetch-xhr.png` and `evidence/browser-network-summary.md` document the user-supplied DevTools screenshot.
- `evidence/document-response-headers.md` documents the user-supplied main-document response details.
- `evidence/passive-response-snapshot.md` documents earlier individual public HTTPS GET observations. It is not a DevTools capture.

## Public architecture observed

- The homepage HTML used `/_next/static/` assets and the sampled responses exposed Vercel/Next.js indicators. The response `Vary` header included Next.js App Router state headers.
- The screenshot's ten same-origin route fetches have names such as `story?_rsc=…`, `careers?_rsc=…`, and `case-studies?_rsc=…`. Their initiator was a Next.js JavaScript chunk. The `_rsc` parameter and initiator are consistent with App Router/React Server Component prefetch traffic. These rows should not be described as ten distinct business APIs without further evidence.
- The screenshot also shows one Google Analytics `collect?v=2&tid=G-LK6CQWCWX0…` request, status 204, initiated by the Google tag script. This is analytics telemetry, not a business API response.
- The contact page has required `fullName`, `email`, and `message` fields and optional `company` and `industry` fields. Earlier review of the public browser bundle found a Server Action reference named `submitInquiry` that receives form data. The screenshot does not show the form being submitted.
- The public privacy page says Cynbit uses Resend for email delivery and Prisma for database management. This is a public disclosure, not confirmation of production configuration or data flow.
- The public `robots.txt` disallows crawling `/api/`, `/admin/`, and `/portal/`. A robots directive is not access control; these paths were not requested.
- The public sitemap lists marketing, careers, product, blog, and policy pages.

## Network screenshot interpretation

The visible rows and values are transcribed in `evidence/browser-network-summary.md`. Most visible route entries returned 304 Not Modified, while `careers`, `case-studies`, and `ai-agents-business-operations` returned 200. The `contact` status is obscured by a tooltip and is marked unknown. The Google Analytics collection request returned 204.

The screenshot does not show method, payload, response headers, response bodies, or full query strings. Because the route-prefetch rows are not evidence of a form submission, there is no observed request body or error response to analyze. The request details panel would be needed to confirm method and headers for each selected row.

## Main document response headers

The user supplied a DevTools capture for `GET https://www.cynbit.in/` with status `304 Not Modified`, shown at 1 November 2026, 00:21:11 GMT. It includes `Server: Vercel`, `X-Vercel-Cache: HIT`, and `Cache-Control: public, max-age=0, must-revalidate`. An `If-None-Match` request header is present, consistent with conditional revalidation. Request/trace IDs and the validator value are redacted in `evidence/document-response-headers.md`.

The supplied 304 response-header list does not show HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Access-Control-Allow-Origin`, or `X-Powered-By`. Earlier individual 200 page samples did include HSTS. Since response codes differ and the 304 is a single response, inspect a fresh 200 before deciding whether security headers are missing across all responses. The DevTools General section displays an effective referrer policy of `strict-origin-when-cross-origin`; that alone does not confirm a `Referrer-Policy` response header.

The request's Cookie header includes the names `_ga` and `_ga_LK6CQWCWX0`; values are intentionally excluded from the repo. Request cookie names do not reveal `HttpOnly`, `Secure`, or `SameSite` attributes. Those require Application → Cookies or `Set-Cookie` response headers.

## Performance interpretation

The screenshot shows ten route-prefetch calls with visible durations between 45 ms and 375 ms and a Google Analytics call at 106 ms. These values are browser request durations for this single capture; they are not TTFB, Lighthouse scores, controlled latency measurements, or proof of a performance problem. The supplied main-document request was a 304 with `X-Vercel-Cache: HIT` and `public, max-age=0, must-revalidate`, showing a cache revalidation path. The prior passive response snapshot records HTML body sizes from individual GETs, but those are not compressed browser transfer sizes.

Run one Lighthouse audit and capture document timing/TTFB, LCP, total transfer size, compression, and cache behavior before recommending performance changes. Keep marketing-page prefetching only where the measured navigation benefit justifies its network cost.

## Security and data handling interpretation

HSTS was observed in prior sampled 200 response headers. CSP, `X-Content-Type-Options`, frame protection, `Referrer-Policy`, and `Permissions-Policy` were not present in those samples. The supplied 304 response header list also omitted HSTS and these other headers; compare a fresh 200 response before drawing conclusions about consistency. CSP should be tested in report-only mode first and tailored to actual resources.

Cookie names are visible in the supplied request headers, but cookie flags and local/session storage contents were not provided. An empty `document.cookie` value would not establish that no cookies exist because HttpOnly cookies are not exposed to page JavaScript. Inspect the DevTools Application panel and record cookie names/flags only; do not publish values or tokens.

## Limitations

- The Network screenshot is a single page-load snapshot and its exact page URL is not visible. The separate main-document capture identifies `/` but is a 304 response.
- Request methods, full URLs, headers, payloads, and responses were not included in the screenshot; the `contact` status is obscured.
- No form was submitted, so the Server Action's server-side validation, rate limiting, spam controls, response handling, and downstream delivery are unknown.
- No Lighthouse report, TTFB, cookie flags, browser storage inventory, authenticated-flow review, source repository, or dependency manifest was supplied.
- The earlier response snapshot is small and point-in-time. It is not a comprehensive security or performance assessment.

## Recommended next steps

1. Capture a fresh 200 Document response's headers to compare with the supplied 304.
2. Select one representative `?_rsc=` row and capture General plus Request/Response Headers, keeping tokens and identifiers redacted.
3. Run Lighthouse once and save the report summary.
4. Inspect Application → Cookies. Record names and flags, never values; check storage key names without copying values.
5. Do not submit a contact/careers form unless Cynbit explicitly authorizes the test and supplies a safe test destination.
6. With authorized source access, review the `submitInquiry` implementation, validation, limits, abuse controls, privacy-safe logging, and downstream provider handling.

## References

### Target site

- Home page: <https://www.cynbit.in/>
- Contact: <https://www.cynbit.in/contact>
- Careers: <https://www.cynbit.in/careers>
- Privacy: <https://www.cynbit.in/privacy>
- Cookies: <https://www.cynbit.in/cookies>
- Robots: <https://www.cynbit.in/robots.txt>
- Sitemap: <https://www.cynbit.in/sitemap.xml>

### Technical guidance

- Next.js, [Data Security](https://nextjs.org/docs/15/app/guides/data-security): Server Actions should be treated as public endpoints.
- Next.js, [Server Actions configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions): origin checking and body-size configuration.
- OWASP, [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).
- OWASP, [HTTP Security Response Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

