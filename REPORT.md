# Cynbit Backend Technical Audit

**Prepared:** 1 November 2026  
**Target:** [https://www.cynbit.in](https://www.cynbit.in)  
**Assessment type:** Passive review of public pages and user-supplied DevTools evidence

## Executive summary

Cynbit's public marketing site is served through Vercel and uses Next.js App Router assets. The supplied Chrome DevTools screenshot shows ten same-site `?_rsc=` fetches that are consistent with route prefetching, plus a Google Analytics collection request. It does not show a conventional business API call or form submission. The screenshot gives visible status, size, and time values for most rows; it does not show request methods, full URLs, headers, bodies, or Lighthouse results.

Earlier passive response snapshots showed HSTS on sampled pages but did not show CSP, `X-Content-Type-Options`, or frame protections. These are defense-in-depth opportunities, not proof of an exploitable vulnerability. The contact form appears to use a Next.js Server Action named `submitInquiry`; whether that action validates input or applies rate limits cannot be established without invoking it or reviewing source code. The assessment email restricts testing to passive and authorized activity, so no form was submitted.

No confirmed exploitable backend vulnerability was established. The prioritized findings and fixes are in [FINDINGS.md](FINDINGS.md).

## Scope and methodology

The assessment used a small number of ordinary HTTPS `GET` requests to public pages and technical files, public page HTML and browser-delivered JavaScript, and a Chrome DevTools screenshot supplied by the user. The screenshot showed the Network panel filtered to Fetch/XHR, Keep log enabled, and No throttling selected. The screenshot itself has no visible address bar or complete timestamp.

No form was submitted, no authentication or hidden paths were tested, and no fuzzing, load testing, exploitation, or scanning was performed. The scope follows the assessment email's passive/authorized testing restriction.

Evidence sources are kept distinct:

- `evidence/network-fetch-xhr.png` and `evidence/browser-network-summary.md` document the user-supplied DevTools screenshot.
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

## Performance interpretation

The screenshot shows ten route-prefetch calls with visible durations between 45 ms and 375 ms and a Google Analytics call at 106 ms. These values are browser request durations for this single capture; they are not TTFB, Lighthouse scores, controlled latency measurements, or proof of a performance problem. The prior passive response snapshot records HTML body sizes from individual GETs, but those are not compressed browser transfer sizes.

Run one Lighthouse audit and capture document timing/TTFB, LCP, total transfer size, compression, and cache behavior before recommending performance changes. Keep marketing-page prefetching only where the measured navigation benefit justifies its network cost.

## Security and data handling interpretation

HSTS was observed in prior sampled response headers. CSP, `X-Content-Type-Options`, frame protection, `Referrer-Policy`, and `Permissions-Policy` were not present in those same samples. A route-level header review in DevTools would improve evidence coverage. CSP should be tested in report-only mode first and tailored to actual resources.

The browser screenshot does not expose cookies, storage, or privacy controls. An empty `document.cookie` value would not establish that no cookies exist because HttpOnly cookies are not exposed to page JavaScript. Inspect the DevTools Application panel and record cookie names/flags only; do not publish values or tokens.

## Limitations

- The screenshot is a single page-load snapshot and its exact page URL is not visible.
- Request methods, full URLs, headers, payloads, and responses were not included in the screenshot; the `contact` status is obscured.
- No form was submitted, so the Server Action's server-side validation, rate limiting, spam controls, response handling, and downstream delivery are unknown.
- No Lighthouse report, TTFB, cookie flags, browser storage inventory, authenticated-flow review, source repository, or dependency manifest was supplied.
- The earlier response snapshot is small and point-in-time. It is not a comprehensive security or performance assessment.

## Recommended next steps

1. Select representative route-prefetch and analytics rows in DevTools and capture General plus Request/Response Headers, ensuring the method and full URL are visible and secrets are not.
2. Capture one Document response's headers and one representative `?_rsc=` response's headers.
3. Run Lighthouse once and save the report summary.
4. Inspect Application → Cookies and Storage. Record names and flags, never values.
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

