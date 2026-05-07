# ARCHITECTURE

## System Overview

SpendScope AI is a Next.js 15 frontend-centric MVP that audits AI tool spend and generates leads for Credex. The architecture prioritizes simplicity (no user database), auditability (deterministic logic), and shareability (URL-encoded results).

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPENDSCOPE AI ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  LANDING PAGE (app/page.tsx)                                     │
│  ├─ Hero + Features + FAQ                                        │
│  └─ CTA → /audit                                                 │
│                                                                   │
│  AUDIT FORM (app/audit/page.tsx)                                 │
│  ├─ Tool selection (8+ tools)                                    │
│  ├─ Plan selection per tool                                      │
│  ├─ Spend input (monthly)                                        │
│  ├─ Team size + use case                                         │
│  └─ localStorage persistence                                     │
│       │                                                           │
│       ▼                                                           │
│                                                                   │
│  AUDIT ENGINE (lib/audit-engine.ts)                              │
│  ├─ Rule-based logic (no AI; deterministic)                      │
│  ├─ Check plan fit for team size                                 │
│  ├─ Detect overlapping tools                                     │
│  ├─ Suggest cheaper alternatives                                 │
│  ├─ Calculate per-tool + aggregate savings                       │
│  ├─ Assign health score + verdict                                │
│  └─ Generate one-line reasoning per recommendation               │
│       │                                                           │
│       ▼                                                           │
│                                                                   │
│  RESULTS PAGE (app/results/[id]/page.tsx)                        │
│  ├─ Decode URL token → render audit result                       │
│  ├─ Hero: total monthly + annual savings                         │
│  ├─ Per-tool breakdown (current → recommended)                   │
│  ├─ Email capture gate (reveals share link after submit)         │
│  └─ AI-generated summary (templated or LLM)                      │
│       │                                                           │
│       ├─→ Supabase: store lead + audit metadata                  │
│       ├─→ Resend: send confirmation email                        │
│       └─→ Return shareable public URL                            │
│                                                                   │
│  PUBLIC RESULT (app/results/[id]/page.tsx — no email gate)       │
│  ├─ Same layout as private version                               │
│  ├─ Open Graph tags for link sharing                             │
│  └─ CTA: "Run your own audit" (referral loop)                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User lands on homepage** → sees hero, features, CTA
2. **Clicks "Run Audit"** → navigates to `/audit`
3. **Fills form** → submitted to audit engine
4. **Audit engine runs** → deterministic rules (no backend call needed)
5. **Results generated** → JSON serialized + base64url encoded into URL token
6. **Redirects to `/results/[token]`** → URL-encoded result decoded and displayed
7. **User sees results** → Hero savings, per-tool breakdown, honest verdict
8. **Email capture form** → email + optional company/role/team size
9. **Submits email** → POST to `/api/email`
   - Supabase stores lead + audit metadata
   - Resend sends transactional confirmation email
   - Returns shareable public URL (`/results/[token]?public=true`)
10. **Share via public URL** → Open Graph preview, visitor lands on results without email gate
11. **Visitor runs own audit** → loop closes (referral)

## Stack Justification

| Component | Choice | Why |
|-----------|--------|-----|
| **Frontend Framework** | Next.js 15 App Router | SSR + static generation for SEO; API routes co-located; built-in optimization |
| **Language** | TypeScript (strict) | Type safety for audit logic; refactorability; team clarity |
| **Styling** | Tailwind CSS v4 + custom theme | Rapid UI build; custom dark palette for premium feel; CSS variables for consistency |
| **State Management** | Zustand + localStorage | Minimal bundle; offline-first form persistence; no Redux boilerplate |
| **Lead Storage** | Supabase (optional for MVP) | Managed PostgreSQL; built-in auth if needed; free tier sufficient for MVP |
| **Email** | Resend (optional for MVP) | Transactional email SaaS; simple API; reliable delivery; free tier for testing |
| **LLM Summary** | Anthropic API (stubbed) | Free credits available; good summarization; fallback to templated summary if API fails |
| **Deployment** | Vercel | Native Next.js optimization; auto-scaling; edge functions for future |

## Why Not...

- **React SPA (Vite):** Needs separate backend for lead storage + email; harder to iterate
- **Vue/Svelte:** Good options but smaller ecosystem; Next.js is faster to ship
- **Firebase:** Simpler than Supabase for this scale; chose Supabase for PostgreSQL SQL familiarity + open-source option later
- **Database-first architecture:** Would add complexity (auth, sessions, migrations). URL-encoded tokens eliminate DB for MVP.
- **One-shot LLM prompt for entire audit:** Rejected for cost and unreliability. Deterministic logic is defensible; LLM only does summary.

## Scaling to 10k audits/day

**Current bottlenecks:**
1. Vercel serverless max execution: 60 seconds (plenty for audit engine)
2. Supabase connection pooling: shared resource; may need upgrade at 1k leads/day
3. Resend email throughput: good to 100k/day; not a blocker
4. Static asset CDN: Vercel handles this; not a blocker

**Changes for 10k audits/day:**
1. **Supabase upgrade:** Move to dedicated connection pool tier (~$100/month)
2. **Caching layer:** Add Redis for frequently-accessed tool pricing (sub-millisecond lookups)
3. **Async email queue:** If volume > 1k leads/day, use Bull/RabbitMQ to decouple email sends from request critical path
4. **Database indices:** Index `audit_leads` table on (created_at, health_score) for analytics queries
5. **API rate limiting:** Add per-IP rate limiting (honeypot + hCaptcha) to prevent bot abuse
6. **Audit engine optimization:** Pre-compute tool overlaps in a lookup table; currently O(n²), can be O(n)

**Estimated infrastructure cost at 10k audits/day:**
- Vercel: $100/month (Pro + Edge Functions)
- Supabase: $500/month (dedicated pool)
- Resend: $100/month (high volume tier)
- Redis: $50/month (small instance)
- **Total: ~$750/month** for 10k audits/day × 30 days = 300k audits/month = $0.0025 per audit (including ops time)

## Database Schema (if scaling past MVP)

```sql
CREATE TABLE audit_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  role VARCHAR(255),
  team_size INTEGER,
  audit_token TEXT, -- base64url encoded result
  share_url TEXT, -- public result URL
  verdict VARCHAR(50), -- over-spending, good, over-optimized
  monthly_savings DECIMAL(10, 2),
  annual_savings DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leads_created ON audit_leads(created_at DESC);
CREATE INDEX idx_leads_verdict ON audit_leads(verdict);
```

## Security Considerations

- **Secrets:** All API keys in `.env.local` (Supabase, Resend, Anthropic) — never in code
- **Public results:** No PII in URL token; company name + email stripped from public version
- **Rate limiting:** Email capture route has honeypot + future hCaptcha
- **CORS:** API routes scoped to same-origin; no data leakage to third parties
- **Input validation:** Audit form validates spend (positive numbers), team size (1–10k), tool selection (whitelist)

## Monitoring & Observability (Future)

- Vercel Analytics for page views + navigation
- Supabase Realtime for lead flow monitoring
- Sentry for error tracking (if LLM integration enabled)
- Custom dashboard: audits per hour, email capture rate, savings distribution

## Deployment Pipeline

```
git push → GitHub Actions CI
  ├─ npm run lint (ESLint flat config)
  ├─ npm run build (Next.js production build)
  └─ if pass → auto-deploy to Vercel
```

No manual steps; code merges to main trigger deployment.
