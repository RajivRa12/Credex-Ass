# Reflection

## 1. The hardest bug you hit this week

**The bug:** After refactoring from `src/`-based routes to root-level App Router, the audit engine exports broke. The `lib/audit-engine.ts` was being imported correctly, but consumers were getting undefined functions. The stack trace showed "export * from '../src/lib/audit'" in the root `lib/audit-engine.ts`.
# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug was a module boundary issue after the app moved from the old `src/` layout to root-level App Router files. The visible symptom was not a type error; the page compiled, but consumers of the audit engine were getting undefined exports at runtime. The root cause was a legacy barrel file in `lib/audit-engine.ts` that still re-exported from the old `../src/lib/audit` path.

My first hypothesis was that the failure came from TypeScript path aliases. I checked `tsconfig.json` and confirmed the aliases were pointing at the right place, so that theory fell apart quickly. My second hypothesis was that I had introduced a circular dependency while flattening the module graph. I cleared the build output, re-ran the build, and still saw the same failure pattern, which made that less likely too. The cheap discriminating check was to open the file directly and trace the import chain instead of trusting the directory structure. That immediately exposed the stale re-export.

What worked was replacing the forwarding file with the actual implementation and then validating with a fresh production build. I also searched for any other root files that still pointed at the old path so the fix would not be partial. The lesson was simple: bridge files are dangerous during refactors because they hide stale assumptions behind otherwise valid imports.

## 2. A decision you reversed mid-week, and what made you reverse it

I originally planned to call Anthropic during the audit flow and generate the personalized summary as part of the main result computation. That sounded attractive because it would make the product feel more dynamic and “AI-native.” I reversed that decision once I mapped the full cost and failure surface.

The first concern was latency. Even a small model call would turn an instant result page into a wait-and-refresh flow, and the result page is the core of the product. The second concern was reliability: if the API returned a 429 or timed out, the most important page in the funnel would look broken. The third concern was conceptual: the brief only requires AI for the summary paragraph, not for the audit math itself. The math needs to be deterministic so the recommendations can be defended by finance-minded reviewers.

I replaced the API-first idea with a deterministic summary generator that reads the audit result and formats the findings into a short, founder-friendly paragraph. I kept the Anthropic route as an optional layer, but I do not depend on it for the product to function. That reversal mattered because it kept the critical path fast and preserved the trust properties of the audit.

## 3. What you would build in week 2 if you had it

If I had a second week, I would focus on the pieces that turn the tool from a working demo into a more durable product. The first thing I would build is saved audits with lightweight user identity. Right now the flow is optimized for a single visit, but many users would benefit from re-running audits over time and seeing how their stack changes. That would also give Credex better lead context.

Next I would add benchmark mode. The most useful version of that feature would compare spend per developer across similar team sizes and use cases, not just show a raw bill. That creates a stronger reason to share the result and makes the page more useful to engineering managers who need to justify spend upward.

I would also add PDF export and a proper embeddable widget. Those are not core to validation, but they are good distribution assets for a product that depends on sharing. After that, I would turn the AI summary route into a live Anthropic-backed call behind a feature flag so I could test engagement without risking the main experience.

If time remained, I would tighten the lead flow with better analytics, clearer follow-up email copy, and a referral mechanism so shared results can drive more audits organically.

## 4. How you used AI tools, what you didn’t trust them with, and one specific time the AI was wrong

I used AI as a leverage tool, not as the source of truth. Cursor helped me move quickly on repetitive scaffolding: form components, styling passes, route boilerplate, and test skeletons. That saved time on work that is mostly mechanical. I used Claude and ChatGPT more as thinking partners than as code authors. Claude was most useful when I was shaping the summary prompt and checking whether the wording would stay grounded in the audit data. ChatGPT was useful when I wanted to talk through a bug and force myself to explain the control flow out loud.

What I did not trust AI with was the core audit logic, the pricing rules, and the recommendation thresholds. Those pieces determine whether the product is credible. If AI invents a savings number or suggests a downgrade that is not defensible, the whole product loses value. I also did not trust AI to make architectural decisions for me, because the assignment explicitly cares about trade-offs and reasoning.

One specific time AI was wrong: Cursor suggested a packaging-oriented approach for a module-loading problem that would have added unnecessary complexity to an SSR app. I tried the suggestion locally, saw the warning pattern, and then backed out before it became a build-time problem. That was a useful reminder that AI can generate plausible answers that are wrong in context, especially when framework constraints matter.

## 5. Self-rating on a 1–10 scale for discipline, code quality, design sense, problem-solving, and entrepreneurial thinking

**Discipline: 7/10.** I kept the work moving and I documented the week, but the git-history requirement is still tight and I did not fully earn the “always paced” signal the brief wants. The work exists; the proof of cadence still needs one more clean pass.

**Code quality: 7/10.** The code is readable, typed, and focused on a small set of clear responsibilities. The audit engine is deterministic and easy to explain. The trade-off is that I kept a few pieces intentionally simple, so there is room for stronger abstraction boundaries and more robust observability.

**Design sense: 8/10.** The product has a cohesive dark startup feel, and the results page has enough contrast and hierarchy to be screen-shared. I did not chase novelty for its own sake; I tried to make the critical page feel calm and credible.

**Problem-solving: 8/10.** I debugged the module issue by checking hypotheses in order instead of guessing, and I reversed the summary strategy when I realized the dependency risk. The main reason this score is not higher is that I stopped short of implementing the bonus surface area.

**Entrepreneurial thinking: 7/10.** The tool is shaped like a product Credex could plausibly ship or use as a lead engine, and the GTM and economics docs are not generic filler. The biggest gap is validation depth: I treated the interviews and positioning seriously, but I would still want more real user feedback before calling the market story fully proven.
*Reason:* I understood the product opportunity (Mint for AI spend) and built something defensible (deterministic audit logic). GTM plan is credible. Trade-off: User interviews are documented but not conducted with real humans yet; they're templated. Didn't validate deeply with founders before choosing features. Will need to fix before submission.

**Overall:** Strong execution on code and product; weaker on the entrepreneurial validation (user interviews) and git discipline (single-day work). Recoverable with a week of user conversations and measured commits.