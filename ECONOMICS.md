# ECONOMICS

## Unit economics: Lead value estimate

**Assumed conversion funnel (Credex perspective):**
1. Audit completed: 100 leads
2. Email captured: 60 leads (60% conversion; some skip email)
3. Credex consultation booked: 15 leads (25% of captured; high-savings cases >$500/mo)
4. Credit purchase agreement signed: 3 deals (20% close rate; avg deal: $5k–$50k annualized spend)

**Lead value calculation:**
- Average Credex deal value: $15k/year (mix of small $5k and larger $50k+ commitments)
- Conservative margin: 30% (after credit cost, payment processing, ops)
- Margin per deal: $4,500
- Expected margin per completed audit: $4,500 × (3/100) = **$135 per audit**
- Expected margin per email: $4,500 × (3/60) = **$225 per email**

*Reasoning: Only high-savings audits (>$500/mo) drive consultation bookings. Credex's credit arbitrage economics support healthy margins on the deals that close.*

---

## Cost structure

**Monthly infrastructure:** ~$100/month (early stage)
- Vercel hosting: $20/month (Next.js, serverless)
- Supabase: $25/month (lead storage, auth if added later)
- Resend email: $20/month (transactional volume tier)
- Monitoring/logging: $10/month
- Anthropic API (if live summary enabled): $0–$50 (depends on usage)

**One-time or periodic:**
- Pricing data maintenance: 4 hours/month @ $100/hr = $400/month labor
- Product updates: varies, assume $1k/month for MVP phase

**Total opex: ~$1,500/month**

---

## CAC (Customer Acquisition Cost) by channel

**Organic / PLG (Product-Led Growth):**
- Referral loop (shared result page): CAC ~$0 (word-of-mouth)
- Twitter / Indie Hacker communities: CAC ~$20 (time cost posting, no paid media)
- HN / Product Hunt: CAC ~$30 (one-time spike, viral potential)

**Paid (if scaling beyond MVP):**
- Google Ads (search: "AI tool audit"): CAC ~$80–$120 (competitive keywords)
- LinkedIn sponsored content: CAC ~$150–$200 (niche audience, lower volume)

**Target: Stay organic for first 100k audits; scale paid only if PLG metrics are strong.**

---

## Conversion rates and funnel

| Stage | Rate | Notes |
|-------|------|-------|
| Visitor → Audit started | 40% | Hero CTA resonates with founders; many bounce |
| Audit started → Completed | 75% | Form friction; most who start finish |
| Audit completed → Email captured | 60% | Value shown first; email gate works |
| Email captured → Consultation booked* | 25% | Only high-savings cases (>$500/mo); honest messaging |
| Consultation booked → Deal closed* | 20% | Credex sales motion; close rate typical for enterprise |

*Credex-dependent; SpendScope controls top 3 stages.*

---

## Path to $1M ARR in 18 months

**Scenario: Aggressive growth**

| Month Range | Audits | Email captures | Deals closed | Revenue (annual run-rate) |
|-------------|--------|-----------------|--------------|--------------------------|
| M1–M3 | 500 | 300 | 15 | $225k |
| M4–M6 | 2,000 | 1,200 | 60 | $900k |
| M7–M9 | 5,000 | 3,000 | 150 | $2.25M |
| M10–M12 | 10,000 | 6,000 | 300 | $4.5M |
| M13–M15 | 20,000 | 12,000 | 600 | $9M |
| M16–M18 | 35,000 | 21,000 | 1,050 | $15.75M |

**Reaching $1M ARR:** Month 5 (with strong viral coefficient and paid acceleration)

**Critical assumptions:**
1. Referral loop + organic channels drive 70% of audits (low CAC)
2. Email capture stays 60% (value-first positioning)
3. Consultation booking stays 25% (honest, high-signal leads)
4. Credex sales close rate 20% on bookings ($15k average deal)
5. No major pricing changes; Credex margin remains 30%

---

## Unit economics at scale

**Break-even analysis:**
- Monthly opex: $1,500
- Revenue per email: $225
- Break-even: 1,500 / 225 = **7 emails/month** (trivial)

**Payback period:**
- Cost to acquire 1 email (organic): ~$0
- Payback: immediate (same audit session)

**Profit margin:**
- At 10k audits/month (6k emails/month): Revenue ~$1.35M/month
- Opex ~$1.5k/month
- Margin: 99.9% (after opex; before Credex credit costs)

*This is a high-margin lead engine. The constraint is volume (user acquisition), not unit economics.*

---

## What has to be true for $1M ARR

1. **Viral loop works:** Shared result pages drive 30%+ of repeat audits (referral coefficient >0.3)
2. **Product retention:** Founders re-audit after 3–6 months as tool stacks evolve
3. **Sales execution:** Credex closes >15% of consultation bookings (not just books them)
4. **Pricing accuracy:** Audits remain defensible; no major customer complaints about accuracy
5. **Credex credits are desirable:** High-savings audit outcomes translate to actual deal flow (credibility)

*If any of these fails, the model requires pivots: add freemium saved audits, benchmark feature, or direct SaaS pricing.*
