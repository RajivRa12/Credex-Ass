# Dev Log

## Day 1 — 2026-05-01

**Hours worked:** 3

**What I did:**
- Read the Credex brief and mapped the required end-to-end flow.
- Sketched the product as landing page → audit form → deterministic engine → results → lead capture → share URL.
- Researched vendor pricing pages and started the pricing list.
- Set up the Next.js 15 app and confirmed the baseline build worked locally.

**What I learned:**
- Credex cares as much about evidence and format as it does about the app itself.
- Pricing data needs to stay sourced and explainable, not inferred.

**Blockers / what I'm stuck on:**
- Choosing the simplest backend that still supports lead storage and transactional email.

**Plan for tomorrow:**
- Build the landing page and audit form.
- Add local persistence so the form survives reloads.

## Day 2 — 2026-05-02

**Hours worked:** 4

**What I did:**
- Built the landing page sections, CTA path, and feature overview.
- Implemented the audit form with tool rows, plans, spend, team size, and use case.
- Wired localStorage persistence so draft inputs survive refreshes.
- Shaped the dark visual system to feel intentional instead of generic.

**What I learned:**
- SSR-safe persistence is easy to get subtly wrong in React apps.
- The UI needs to stay visually calm because the results page carries the main message.

**Blockers / what I'm stuck on:**
- The audit engine still needs the actual recommendation logic.

**Plan for tomorrow:**
- Implement the deterministic audit engine.
- Start the results page.

## Day 3 — 2026-05-03

**Hours worked:** 5

**What I did:**
- Implemented the core audit engine with pricing-aware recommendations.
- Added the results page with savings totals and per-tool guidance.
- Included the first version of the AI summary output.
- Started shaping the email capture experience after results were shown.

**What I learned:**
- The audit logic has to be conservative; over-claiming savings would hurt trust.
- A good result page needs to explain the why, not just the number.

**Blockers / what I'm stuck on:**
- Lead capture still needs backend wiring and error handling.

**Plan for tomorrow:**
- Add shareable tokens and public result URLs.
- Wire email capture to storage and transactional email.

## Day 4 — 2026-05-04

**Hours worked:** 4

**What I did:**
- Implemented the share token flow for result URLs.
- Added Open Graph image generation for social previews.
- Wired the email capture route with backend stubs.
- Added share actions to make result pages easier to pass around.

**What I learned:**
- Shareable URLs are only useful if they still protect personal data.
- Open Graph previews matter a lot for a product that relies on sharing.

**Blockers / what I'm stuck on:**
- Production credentials and deployment validation are still pending.

**Plan for tomorrow:**
- Polish the interface.
- Finish the required docs and test notes.

## Day 5 — 2026-05-05

**Hours worked:** 3

**What I did:**
- Created the required root docs: README, ARCHITECTURE, REFLECTION, PRICING_DATA, PROMPTS, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS, and TESTS.
- Added the GitHub Actions CI workflow.
- Ran lint and production build checks locally.

**What I learned:**
- Writing the docs exposed the product trade-offs more clearly than the code did.
- The assignment is really testing product judgment, not just implementation.

**Blockers / what I'm stuck on:**
- The submission still needs a live deploy and honest interview notes.

**Plan for tomorrow:**
- Review the docs for completeness.
- Validate the flow end to end.

## Day 6 — 2026-05-06

**Hours worked:** 2

**What I did:**
- Reviewed the docs for missing requirements and stale wording.
- Spot-checked pricing sources against vendor pages.
- Re-ran the app locally to confirm the main user flow still worked.
- Cleaned up a few rough edges in the submission narrative.

**What I learned:**
- A submission can look finished while still missing a few programmatic checks.
- Honest wording is safer than trying to make incomplete parts sound complete.

**Blockers / what I'm stuck on:**
- Deployment and git-history compliance still need one more pass.

**Plan for tomorrow:**
- Final submission prep.
- Fix any remaining compliance gaps.

## Day 7 — 2026-05-07

**Hours worked:** 2

**What I did:**
- Did a final code and docs review.
- Verified the CI workflow structure.
- Confirmed the required files were present at the repo root.
- Prepared the production build for submission.

**What I learned:**
- The work is only submission-ready if the evidence matches the product.

**Blockers / what I'm stuck on:**
- Deployment and interview validation still need to be completed before final handoff.

**Plan for tomorrow:**
- Submit once the remaining checks are resolved.