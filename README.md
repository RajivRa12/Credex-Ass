# SpendScope AI

**Audit your AI tool spend. Find overlap. Save money.**

SpendScope AI is a free web app that helps founders and engineering teams discover overspend on AI and productivity tools—and quantifies exact savings opportunities with deterministic, auditable logic.

**For:** Early-stage startups, product teams, and operators reviewing AI infrastructure costs.

## What it does

1. **Spend input form** — Add your tools, plans, monthly spend, team size, and primary use case.
2. **Instant audit engine** — Detects plan mismatches, overlapping tools, and cheaper alternatives.
3. **Results page** — See per-tool recommendations, total monthly + annual savings, and an AI-generated summary.
4. **Email capture + lead storage** — Share findings with team; Credex consults on high-savings cases (>$500/mo).
5. **Shareable public URL** — Social preview–ready result page for internal or external sharing.

## Features

- ✅ Support for 8+ AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf)
- ✅ Rule-based audit engine with sourced pricing (no invented savings)
- ✅ URL-encoded result tokens (shareable without backend)
- ✅ Email capture with Supabase + Resend integration
- ✅ Open Graph previews for link sharing
- ✅ Premium dark startup UI (Tailwind v4, glass panels, gradient borders)
- ✅ TypeScript strict mode, ESLint, GitHub Actions CI

## Quick start

```bash
# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment setup (optional for full features)

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@spendscope.app
ANTHROPIC_API_KEY=your_anthropic_api_key  # for LLM summary
```

## Deploy

```bash
# Build for production
npm run build
npm run start

# Deploy to Vercel (recommended)
vercel deploy
```

**Live URL:** [Add your deployed URL here]

## Screenshots

[Add 30-second Loom/YouTube video walkthrough or screenshots here]

- Landing page with audit CTA
- Audit form with tool selection
- Results page showing savings breakdown
- Shareable result with email capture

## Decisions (Trade-offs)

1. **Deterministic audit logic vs. AI-generated recommendations** — Chose rule-based because finance teams trust numbers backed by explicit reasoning, not AI confidence scores. We hardcoded pricing thresholds and overlap detection; an LLM only generates the summary paragraph.

2. **URL-encoded results vs. database-backed audits** — For MVP, encoded results in the URL eliminate backend infrastructure and auth complexity. Trade-off: can't save user history. Revisit if repeat audits become common.

3. **Email capture after value shown, not before** — Credex requirement: show the audit *first*, then email gate. This maximizes conversion because users see real savings before committing contact info. Reduces lead volume but improves lead quality.

4. **Supabase + Resend vs. rolling custom** — Chose managed services to reduce ops burden and focus on product logic. Trade-off: small monthly cost for infrastructure. Worth it to ship faster and have audit trails.

5. **Tailwind v4 + custom dark palette vs. shadcn/ui** — Built a custom premium dark theme (glass, gradients, startup feel) rather than using pre-built component libraries. More control over brand and UX polish; takes longer to scaffold, pays off in visual differentiation.

## How it works

1. User inputs tools, plans, spend, and team size.
2. Audit engine checks:
   - Is the current plan right-sized for the team?
   - Are there cheaper plans from the same vendor?
   - Are there substantially cheaper alternatives with similar capability?
   - Can the same capability be sourced through Credex credits?
3. Results show per-tool recommendations with savings and one-line reasoning.
4. If savings >$500/mo, Credex consultation CTA surfaces.
5. Email captures lead + shares unique public result URL.
6. Result page has Open Graph tags for clean sharing.

## Tech stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4
- **State:** Zustand (audit form), localStorage (draft persistence)
- **Backend:** Supabase (lead storage), Resend (email), Anthropic API (optional LLM summary)
- **CI/CD:** GitHub Actions (lint + build on every push)
- **Deployed on:** Vercel

## Testing

```bash
npm run lint      # ESLint (flat config)
npm run build     # Production build
npm run test      # Run test suite (Jest/Vitest)
```

See [TESTS.md](./TESTS.md) for test coverage details.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design, data flow, scaling thoughts
- [DEVLOG.md](./DEVLOG.md) — Day-by-day progress and learnings
- [REFLECTION.md](./REFLECTION.md) — Decisions, bugs, and self-assessment
- [PRICING_DATA.md](./PRICING_DATA.md) — Every tool price with vendor sources
- [PROMPTS.md](./PROMPTS.md) — LLM prompt for summary generation
- [GTM.md](./GTM.md) — Go-to-market strategy and acquisition channels
- [ECONOMICS.md](./ECONOMICS.md) — Unit economics and path to $1M ARR
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) — Real conversation notes with founders
- [LANDING_COPY.md](./LANDING_COPY.md) — Marketing copy and FAQs
- [METRICS.md](./METRICS.md) — North Star metric and instrumentation plan
