# Dev Log

## 2026-05-07

# Dev Log

## Day 1 — 2026-05-01

**Hours worked:** 3

**What I did:**
- Read the Credex assignment brief.
- Sketched the MVP flow: form → audit engine → results → email capture → shareable URL.
- Researched current AI tool pricing across official vendor pages.
- Set up Next.js 15 project locally, pinned to version 15.5.16.

**What I learned:**
- Pricing changes monthly; consistency across vendor pages varies.
- Next.js 15 has subtle differences in middleware and dynamic routes.

**Blockers / what I'm stuck on:**
- Choosing lead storage: Supabase vs. Firebase vs. custom Postgres.

**Plan for tomorrow:**
- Scaffold landing page with hero, features, and CTA.
- Build audit form with tool rows and local persistence.
- Stub the audit engine with placeholder logic.

---

## Day 2 — 2026-05-02

**Hours worked:** 4

**What I did:**
- Built landing page: hero, features grid, 3-step flow, pricing preview, FAQ.
- Implemented audit form with tool selection, plan selection, spend, team size, use case.
- Form state persisted to localStorage.
- Applied custom dark theme with Tailwind v4.

**What I learned:**
- Tailwind v4 CSS variables require careful inheritance (--background, --panel, --accent).
- localStorage hook needs SSR-safe implementation.

**Blockers / what I'm stuck on:**
- Audit engine logic needs overlap detection algorithm.

**Plan for tomorrow:**
- Implement core audit engine with plan recommendations.
- Build results page.

---

## Day 3 — 2026-05-03

**Hours worked:** 5

**What I did:**
- Implemented deterministic audit engine with pricing checks.
- Built results page with hero savings display.
- Added per-tool recommendations with savings and reasoning.
- Added email capture form.

**What I learned:**
- Overlap detection requires domain knowledge; hard to automate.
- Savings numbers must be defensible with explicit reasons.

**Blockers / what I'm stuck on:**
- Email capture needs Supabase/Resend wiring.

**Plan for tomorrow:**
- Implement URL-encoded result tokens.
- Wire email capture to Supabase + Resend.
- Add Open Graph image generation.

---

## Day 4 — 2026-05-04

**Hours worked:** 4

**What I did:**
- Implemented URL-encoded token system for shareable results.
- Added Open Graph image generation.
- Wired email capture route with Supabase + Resend stubs.
- Added share buttons on results page.

**What I learned:**
- URL encoding has length limits; tested worst-case stays under 2KB.
- Open Graph image generation in Next.js requires JSX component.

**Blockers / what I'm stuck on:**
- Supabase credentials are placeholders; full integration testing deferred.

**Plan for tomorrow:**
- Polish UI.
- Write comprehensive documentation.

---

## Day 5 — 2026-05-05

**Hours worked:** 3

**What I did:**
- Created all documentation files: README, ARCHITECTURE, DEVLOG, REFLECTION, PRICING_DATA, PROMPTS, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS, TESTS.
- Set up GitHub Actions CI workflow.
- Validated `npm run lint` and `npm run build`.

**What I learned:**
- Writing docs forces articulation of assumptions and gaps.
- Deterministic rules are straightforward for readers.

**Blockers / what I'm stuck on:**
- User interviews not conducted yet; template only.
- Lighthouse scores require live deployment.

**Plan for tomorrow:**
- Review documentation completeness.
- Prepare for final submission.

---

## Day 6 — 2026-05-06

**Hours worked:** 2

**What I did:**
- Reviewed all documentation for completeness.
- Double-checked pricing against vendor websites.
- Tested audit form end-to-end locally.
- Final lint pass: no errors.

**What I learned:**
- Form + engine + results flow is complete and polished.

**Blockers / what I'm stuck on:**
- Waiting on user interviews + deployment.

**Plan for tomorrow:**
- Final submission prep.

---

## Day 7 — 2026-05-07

**Hours worked:** 2

**What I did:**
- Final code review and import checks.
- Verified CI workflow structure.
- Confirmed all deliverables present.
- Prepared production build artifact.

**What I learned:**
- Project is production-ready from code perspective.

**Blockers / what I'm stuck on:**
- Deployment and user interviews deferred.

**Plan for tomorrow:**
- Submit to Credex pending deployment and interviews.