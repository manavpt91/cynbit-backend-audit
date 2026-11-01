# Cynbit Backend Technical Audit

**Prepared:** 1 November 2026  
**Target:** [https://www.cynbit.in](https://www.cynbit.in)  
**Assessment type:** Passive review of the public website and its browser-delivered assets

## Executive summary

Cynbit's public marketing site is served through Vercel and uses Next.js App Router assets. The public contact page contains a five-field inquiry form. Its browser bundle routes submissions through a Next.js Server Action named `submitInquiry`. The live server-side action implementation is not available in public page assets, and this review did not submit the form, so input validation, persistence, rate limiting, spam controls, and email delivery behavior remain unverified.

The sampled HTML responses included HSTS, but did not include several useful browser defense-in-depth headers: Content-Security-Policy, X-Content-Type-Options, and frame protections (either CSP `frame-ancestors` or X-Frame-Options). This is a hardening opportunity, not evidence that an exploitable vulnerability exists. The most important application-level follow-up is to confirm that the public Server Action independently validates and bounds all fields and has abuse controls.

No confirmed exploitable backend vulnerability was established from this passive review. The report prioritizes verifiable hardening work and lists questions that need source-code or operator access to answer.

## Scope and method

On 1 November 2026 at approximately 00:09 UTC, I made ordinary HTTPS `GET` requests to the home page, `/contact`, `/careers`, `/privacy`, `/terms`, `/cookies`, `/robots.txt`, and `/sitemap.xml`. I read the public contact page's delivered HTML and associated public JavaScript chunk to understand the visible form and submission mechanism. The public pages were also checked against their linked privacy/cookie disclosures.

I did not submit any form, send POST requests, enumerate unlinked routes, access `/admin/` or `/portal/`, attempt authentication, test payloads, run a scanner, or generate traffic beyond these low-volume page reads. The assignment email permits passive and authorized testing only; this report follows that constraint.

## Public architecture observed

- The home page response identified Vercel as the server and included `/_next/static/` assets. The contact and careers responses also exposed `x-powered-by: Next.js`. The `vary` response header included Next.js App Router state headers.
- The contact form exposes required `fullName`, `email`, and `message` fields, plus optional `company` and `industry` fields. The browser bundle creates a Server Action reference named `submitInquiry` and passes it a `FormData` object.
- The public privacy page says Cynbit uses Resend for email delivery and Prisma for database management. This is a statement by the site; the review did not verify production data flows or provider configuration.
- The public robots file disallows crawling `/api/`, `/admin/`, and `/portal/`. This is a crawler directive, not an access-control mechanism; this review did not request those paths.
- The public sitemap lists the main marketing, careers, product, blog, and policy pages.

### Sampled page response snapshot

| Page | Status | Retrieved body | Cache-Control | Sampled security headers |
|---|---:|---:|---|---|
| `/` | 200 | 100,498 bytes | `public, max-age=0, must-revalidate` | HSTS present; CSP, `nosniff`, frame, referrer, and permissions headers absent |
| `/contact` | 200 | 64,026 bytes | Not present in captured response | HSTS present; CSP, `nosniff`, frame, referrer, and permissions headers absent |
| `/careers` | 200 | 125,485 bytes | `private, no-cache, no-store, max-age=0, must-revalidate` | HSTS present; CSP, `nosniff`, frame, referrer, and permissions headers absent |

The body sizes above are retrieved HTML body byte counts, not browser transfer sizes after compression. This small sample is useful for documenting the observation but is not a performance benchmark.

## Findings and recommendations

### F-01: Add a deliberate browser security-header baseline

**Category:** Security hardening  
**Priority:** P2 (defense in depth)  
**Confidence:** High for the sampled responses; impact is preventive

**Evidence:** The home page, contact page, and careers page returned `Strict-Transport-Security: max-age=63072000`. In the same sampled HTML responses, I did not observe `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, or `Permissions-Policy`. I checked response headers, not only HTML meta tags.

**Why it matters:** HSTS is a positive control. A CSP can restrict where scripts and other resources load from and can set `frame-ancestors` to prevent unwanted embedding. `X-Content-Type-Options: nosniff` and a deliberate referrer policy provide additional browser protections. Their absence does not establish an exploitable issue on its own.

**Recommendation:** Configure and review headers centrally for every HTML route and error response. Start CSP in report-only mode, inventory required sources (including analytics and any external fonts/images), then enforce a least-privilege policy. Set `frame-ancestors` in CSP; use `X-Frame-Options: DENY` or `SAMEORIGIN` where compatibility requires it. Add `X-Content-Type-Options: nosniff`, an appropriate `Referrer-Policy`, and a restrictive `Permissions-Policy`. Keep HSTS only with a domain/subdomain policy appropriate to the deployment.

### F-02: Verify server-side validation and abuse controls for `submitInquiry`

**Category:** API behavior, data validation, availability  
**Priority:** P2 (public mutation surface)  
**Confidence:** High that the action is exposed in the browser bundle; server-side controls are unknown

**Evidence:** The contact form's HTML has browser-side `required` attributes and an email input type. The public JavaScript chunk creates a Server Action reference named `submitInquiry`, constructs `FormData`, and calls the action. These browser checks can be bypassed by a caller; they do not show whether the server validates the data.

**Why it matters:** The action accepts personal contact details and a free-form message. Without server-enforced field limits and abuse controls, the endpoint could receive malformed or excessive data or be used for spam. This review did not invoke the action, so it makes no claim that validation or rate limiting is missing.

**Recommendation:** Validate every field on the server using an allowlist of expected keys, trim strings, apply explicit maximum lengths, validate the email address, and reject unexpected values. Enforce a request/body limit and rate limits at the application or edge layer, using a shared store if deployed to multiple instances. Add spam controls that do not rely on a hidden field alone. Queue delivery with bounded retries; avoid logging message bodies or full email addresses. Return a generic result and a correlation ID rather than provider or stack details. See `examples/contact-action.ts` for an illustrative shape.

For an authorized source review, confirm the action validates independently of HTML constraints, applies size limits before expensive work, limits message delivery, protects secrets, and handles provider/database failures without exposing internals. Treat the Server Action like a public API, as Next.js documentation recommends.

### F-03: Align privacy and cookie disclosures with actual runtime behavior

**Category:** Data handling and transparency  
**Priority:** P3 (operational verification)  
**Confidence:** High that these statements appear on the public policy pages; actual runtime behavior not verified

**Evidence:** The privacy page says inquiry and BitElevate information is used to respond to requests, names Resend and Prisma as service providers, and offers access/deletion requests via email. The cookie page describes essential, analytics, and functional cookies, including Google Analytics. This review did not submit personal data or inspect a browser cookie jar, analytics network traffic, or provider retention settings.

**Recommendation:** Compare the deployed form and cookie behavior with these statements. Document the fields collected, purposes, processors, retention period, and deletion workflow. Confirm whether analytics/functional cookies are set before or after user choice, and make consent controls match the actual behavior and applicable requirements. Do not send message content to analytics. Ensure logs and email delivery have retention/access rules consistent with the policy.

### F-04: Establish a measured performance baseline before tuning

**Category:** Performance opportunity  
**Priority:** P3 (measure first)  
**Confidence:** Medium; this was a single-request snapshot, not a benchmark

**Evidence:** The HTML bodies retrieved in this sample were approximately 100 KB for `/`, 64 KB for `/contact`, and 125 KB for `/careers`. The home page response used `public, max-age=0, must-revalidate`; the careers page used `private, no-cache, no-store, max-age=0, must-revalidate`; the contact response did not include a Cache-Control header in the captured response. These are body sizes and headers from one point-in-time request, not compressed transfer sizes, render timings, or cache-hit measurements.

**Recommendation:** Measure Core Web Vitals and a browser network waterfall on representative mobile and desktop connections. Check compression, image sizing, JavaScript execution, and route-level caching. Keep personalized or mutation-related responses private; cache only pages and assets that are safe to share. Use CDN caching for immutable `/_next/static/` assets and verify that the public route cache strategy is intentional. Avoid treating these HTML sizes alone as proof of a performance defect.

## Positive controls observed

- HTTPS responses included HSTS with a two-year `max-age`.
- The public pages were server-rendered and included browser-delivered Next.js App Router assets.
- The contact form's visible fields are labeled and the three core fields are marked required in the delivered markup. This is usability support, not a substitute for server validation.
- The public site provides privacy and cookie policy pages and names email/database service providers.

## Not established by this review

- Whether the Server Action validates data server-side, rate-limits requests, has bot/spam defenses, or queues email reliably.
- Whether authentication is required for any non-public application route, or whether authorization checks are correct. No authenticated area was tested.
- Whether the named database/email providers are configured securely, what data is persisted, or how long it is retained.
- Whether vulnerabilities exist in dependencies or server code. No source repository or dependency manifest was provided.
- Real-world performance, availability, cache-hit rates, and load behavior. No load testing was performed.

## Suggested next steps for an authorized code review

1. Review the `submitInquiry` server action and any underlying persistence/delivery functions.
2. Confirm server-side schema validation, input and body limits, rate limits, bot controls, error handling, and PII-safe logs.
3. Review Next.js/Vercel configuration for security headers, Server Action origin/body-size settings, and cache behavior.
4. With explicit authorization, use a staging environment and test valid/invalid contact submissions, rate limiting, and expected error handling without sending real messages.
5. Measure browser-level performance with representative pages and devices.

## References

### Target site, checked 1 November 2026

- Cynbit home page: <https://www.cynbit.in/>
- Contact page: <https://www.cynbit.in/contact>
- Careers page: <https://www.cynbit.in/careers>
- Privacy policy: <https://www.cynbit.in/privacy>
- Cookie policy: <https://www.cynbit.in/cookies>
- Public robots file: <https://www.cynbit.in/robots.txt>
- Public sitemap: <https://www.cynbit.in/sitemap.xml>
- Public contact page JavaScript chunk observed in its HTML: <https://www.cynbit.in/_next/static/chunks/app/(marketing)/contact/page-a581c8d7462124d9.js>

### Technical guidance

- Next.js, [Data Security](https://nextjs.org/docs/15/app/guides/data-security): Server Actions should be treated as public endpoints and validated accordingly.
- Next.js, [Server Actions configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions): origin checking and body-size configuration.
- OWASP, [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).
- OWASP, [HTTP Security Response Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

