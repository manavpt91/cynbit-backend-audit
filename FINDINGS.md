# Findings

| ID | Category | Severity | Evidence | Recommended fix |
|---|---|---|---|---|
| F-01 | Security headers | P2 - defense in depth | Earlier passive 200 samples included HSTS but no observed CSP, `X-Content-Type-Options`, frame protection, `Referrer-Policy`, or `Permissions-Policy`. The supplied 304 response dump also omits HSTS and these headers. See `evidence/passive-response-snapshot.md` and `evidence/document-response-headers.md`; compare a fresh 200 before concluding policy is inconsistent. | Add and centrally test a security-header baseline across 200, 304, and error responses. Start CSP in report-only mode and use `frame-ancestors`; see `recommendations/security-headers.ts`. |
| F-02 | Input validation / abuse control | P2 - public mutation surface to verify | Contact form exposes required name, email, and message fields and optional company/industry. Earlier inspection of the public client bundle showed a `submitInquiry` Server Action. No form was submitted, so server validation and rate limiting are unknown. | Validate on the server, bound request and field sizes, rate-limit by a trusted client key, queue delivery, and return generic errors. See `recommendations/contact-validation.ts`, `recommendations/contact-action.ts`, `recommendations/rate-limit.ts`, and `recommendations/error-handler.ts`. |
| F-03 | Privacy and data handling | P3 - verify operational alignment | The public privacy page names Resend and Prisma and describes inquiry data use; the cookie page describes analytics and functional cookies. Runtime storage, consent, and retention were not verified. | Compare deployed behavior with disclosures; set retention and deletion workflows; avoid sending message content to analytics. |
| F-04 | Performance | P3 - measure before tuning | The provided screenshot shows 10 Next.js route-prefetch fetches with visible durations of 45-375 ms, plus a Google Analytics collect request at 106 ms. The supplied main-document request was a `304` with `X-Vercel-Cache: HIT`, `If-None-Match`, and `public, max-age=0, must-revalidate`. These are single-request observations, not a Lighthouse run or controlled benchmark. | Run one Lighthouse audit and record TTFB, LCP, transfer/compressed sizes, caching, and resource timing. Review prefetch strategy and analytics only if metrics identify a bottleneck. |

## Severity notes

No exploitable backend vulnerability was confirmed. P2 items are hardening and verification work, not proof of a vulnerability. P3 items are operational or measurement opportunities.

