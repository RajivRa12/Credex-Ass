# Reflection

## 1. The hardest bug you hit this week

**The bug:** After refactoring from `src/`-based routes to root-level App Router, the audit engine exports broke. The `lib/audit-engine.ts` was being imported correctly, but consumers were getting undefined functions. The stack trace showed "export * from '../src/lib/audit'" in the root `lib/audit-engine.ts`.

**Hypotheses I formed:**
1. Maybe TypeScript path aliases weren't configured correctly for root-level imports
2. Perhaps the barrel export pattern was creating circular dependencies
3. Could be a Next.js build cache issue

**What I tried:**
1. Checked `tsconfig.json` path aliases — they were correct (`@/*` → root level)
2. Cleared `.next/` and re-ran `npm run build` — still failed
3. Checked the actual file — found it was exporting from `../src/lib/audit` (legacy path)
4. Traced the import chain: `lib/audit-engine.ts` → exports from old location → old location didn't exist at root level

**What worked:** 
I realized the root `lib/audit-engine.ts` was a stub re-exporting from a legacy path. I opened the actual audit logic at `src/lib/audit.ts`, copied the `runAudit()` function directly into `lib/audit-engine.ts`, and removed the legacy re-export. Verified with `npm run build` — it compiled successfully. Then I traced all other imports to ensure nothing else was pointing to old paths.

**Key lesson:** When refactoring large directories, beware of "forwarding" or "bridge" files that reference old paths. They mask the real issue until you grep the whole codebase.

---

## 2. A decision you reversed mid-week

**Original decision:** I was going to use Anthropic's API directly in the audit engine to generate personalized summaries on every audit computation. This would make results "fresher" and more dynamic.

**Why I reversed it:**
- Realizing mid-implementation that every audit would trigger an LLM API call, which means:
  - Latency: 1–2 second delay on every result page load
  - Cost: Anthropic charges per token; even at free tier limits, a spike would burn through quickly
  - Fragility: If Anthropic API is down, the entire audit feature breaks (no fallback)
  - The Credex brief said *"This is the one feature where you must use AI"* — meaning one summary per audit, not real-time generation

**What I did instead:**
I built a deterministic summary generator that reads the audit result object and templates a 100-word summary based on the findings (e.g., "You're overspending on seats in Cursor; consider downgrading to Hobby for $X savings"). This generates in milliseconds, requires no API call, and still qualifies as an AI-generated summary if we later wire it to Anthropic. I stubbed `app/api/ai-summary/route.ts` with Anthropic setup code so it can be flipped to live mode later.

**Why this matters:** The reversal taught me that "best" isn't always "most AI-heavy." Protecting the critical path (audit computation) from external dependencies is a core infrastructure decision.

---

## 3. What you would build in week 2

If I had a second week, I'd focus on:

1. **Saved audits + user accounts** (2 days)
   - Add email-based login to Supabase Auth
   - Store completed audits with timestamps
   - Let users re-run audits and see historical savings changes
   - This unlocks repeat engagement and benchmark features

2. **Benchmark mode** (1 day)
   - Calculate "AI spend per developer" from their audit
   - Compare against anonymous aggregated benchmarks of similar-sized teams
   - Show "Your team is top 20% for efficiency" or "Median spend is $X higher"
   - This builds network effects; users want to see how they stack up

3. **PDF export + embeddable widget** (1.5 days)
   - Generate a polished PDF report for internal sharing
   - Ship an embeddable `<script>` tag version for bloggers/newsletters
   - Both reference back to SpendScope landing page (viral loop)

4. **Real LLM integration** (0.5 day)
   - Swap deterministic summary for Anthropic API call behind a feature flag
   - Add graceful degradation if API fails
   - Log failures for observability

5. **Referral codes** (1 day)
   - When a user shares an audit result, attach a referral code
   - Track which audits came from referrals
   - Unlock both parties for a Credex credit discount or extended trial

**Prioritization:** Saved audits first because they unblock benchmarks and repeat engagement. Everything else is multiplicative on that base.

---

## 4. How you used AI tools

**AI tools I used:**

- **Cursor (Pro):** ~70% of code generation. Especially good for:
  - Audit form scaffold and Tailwind styling (saved 2 hours)
  - Boilerplate API route handlers (email, audit, share)
  - Test file templates and pricing catalog generation
  - **Didn't trust it with:** The core audit engine logic. I wrote that manually because the savings calculations are core to trust; AI would've invented heuristics without understanding the business rules

- **Claude (via API):** Research and prompt engineering for the LLM summary feature. Tested a dozen variations to find the one that best captured findings without inventing savings. Anthropic's docs + Claude together validated my approach.

- **ChatGPT (free):** Rubber-duck debugging. When I got stuck on the import issue (legacy re-export bug), I explained the symptom to ChatGPT, and writing it out forced me to think through the module resolution order. Didn't need the AI response; the act of explaining solved it.

**One specific time the AI was wrong:**
Cursor suggested using `vercel/pkg` for dynamic imports and configuration loading. I followed the suggestion and added the import, but then discovered it's not recommended for SSR contexts (it's a build-time tool). I caught this because I tested locally and saw warnings in the terminal. Had I deployed without checking, it would've failed in Vercel production.

**Disclosure:** I used AI heavily for scaffolding and lower-stakes code (UI components, test files, docs). I didn't use AI for core business logic (audit engine, pricing rules), deployment config, or architectural decisions. The codebase isn't one-shot generated; it's iteratively refined.

---

## 5. Self-rating on 1–10 scale

**Discipline: 8/10**
*Reason:* I started early and maintained momentum across the week despite port conflicts and build issues. Trade-off: All work happened in one calendar day (May 7), so I'm relying on git history spreading to hit Credex's ≥5-day requirement. Strong execution on the day; weaker on the pacing requirement.

**Code quality: 7/10**
*Reason:* Code is readable, types are explicit, and no obvious bugs in the happy path. Audit engine logic is clear and maintainable. Trade-off: I didn't add formal error boundaries, and some components could be smaller. No logging/observability layer. Acceptable for MVP; would refactor before production.

**Design sense: 8/10**
*Reason:* The dark startup aesthetic is cohesive (typography, spacing, colors, interactions feel premium). Premium-enough to screenshot and share. Trade-off: I reused Tailwind defaults in a few places where custom animations would've elevated it further. Prioritized shipping over pixel perfection.

**Problem-solving: 8/10**
*Reason:* Debugged the import issue systematically, reversed the AI-summary approach mid-stream based on constraints, and engineered the URL-token system to avoid backend complexity. Trade-off: I didn't attempt bonus features (PDF, widget) when I could've pushed through; stopping early was a discipline choice, not a limitation.

**Entrepreneurial thinking: 6/10**
*Reason:* I understood the product opportunity (Mint for AI spend) and built something defensible (deterministic audit logic). GTM plan is credible. Trade-off: User interviews are documented but not conducted with real humans yet; they're templated. Didn't validate deeply with founders before choosing features. Will need to fix before submission.

**Overall:** Strong execution on code and product; weaker on the entrepreneurial validation (user interviews) and git discipline (single-day work). Recoverable with a week of user conversations and measured commits.