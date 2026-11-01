# Cynbit Backend Audit

This repository contains a passive, public-surface backend review prepared for the Cynbit Backend Developer Intern assessment.

## Contents

- [Audit report](AUDIT.md): scope, evidence, findings, limitations, and recommendations.
- [Contact action example](examples/contact-action.ts): illustrative server-side validation and abuse-control pattern for the public inquiry form.

## Scope

The review used ordinary HTTPS `GET` requests to publicly linked Cynbit pages and public static assets. The contact form was inspected as delivered to the browser, but it was not submitted. No authenticated areas, unlinked routes, or hidden endpoints were accessed. No vulnerability exploitation, load testing, or intrusive testing was performed.

The report is a point-in-time assessment of the public surface, not a source-code audit or penetration test. It distinguishes confirmed observations from controls that require authorized access to verify.

## Run the example

`examples/contact-action.ts` is a reference pattern, not a drop-in implementation. It assumes the application provides a shared rate limiter, a trusted client-address resolver configured for its proxy, and an inquiry delivery service. Those dependencies must be implemented and reviewed before deployment.

