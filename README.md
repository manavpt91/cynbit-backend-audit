# Cynbit Backend Audit

Passive review of Cynbit's public website for the Backend Developer Intern assessment.

## Repository contents

```text
cynbit-backend-audit/
├── README.md
├── REPORT.md
├── FINDINGS.md
├── recommendations/
│   ├── contact-action.ts
│   ├── contact-validation.ts
│   ├── error-handler.ts
│   ├── rate-limit.ts
│   └── security-headers.ts
└── evidence/
    ├── browser-network-summary.md
    ├── network-fetch-xhr.png
    └── passive-response-snapshot.md
```

## Summary

The public site uses Next.js App Router and is served through Vercel. The supplied DevTools screenshot records Next.js route-prefetch fetches and a Google Analytics collection request. It does not show a contact/careers submission or a conventional business API request. The principal recommendations are to verify server-side validation and abuse controls on the contact Server Action, add a deliberate security-header baseline, and measure performance with Lighthouse before tuning.

## Scope and methodology

The assessment used a small number of ordinary HTTPS page reads plus the user-provided Chrome DevTools Network screenshot. No form was submitted, no authentication or hidden paths were tested, and no fuzzing, load testing, or exploitation was performed. The screenshot does not show request methods, complete URLs for every row, headers, request/response bodies, cookie flags, or Lighthouse metrics; the report marks those as unknown instead of inferring them.

Earlier page-response observations in `evidence/passive-response-snapshot.md` came from individual passive HTTPS GET requests, not from the screenshot. Keep those evidence sources distinct when presenting the report.

## Recommendations

The TypeScript files under `recommendations/` are illustrative patterns. The contact action requires production implementations for trusted client identification and message delivery. The rate limiter sample uses Upstash packages and a shared Redis store. Review all snippets against the actual framework version and deployment before using them.

