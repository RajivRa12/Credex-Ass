# METRICS

## North Star Metric

**Audits completed with >$100 annual savings identified per week**

Why this metric:
- Measures product utility (not just traffic)
- Signals honest audits (tool has real value)
- Drives eventual lead quality for Credex
- Leading indicator of viral loop (users share high-savings results)

Alternative metrics rejected:
- Weekly active users (doesn't capture value realization)
- Audits started (many incomplete, low signal)
- Emails captured (lagging indicator; depends on results page quality)

---

## Three input metrics that drive the North Star

1. **Audit completion rate** (% of form started → audit result delivered)
   - Measures form friction; target: 75%+
   - If declining: form UX issue, pricing data inaccuracy, or trust breakdown

2. **Average savings per audit** ($X in annual savings per audit)
   - Measures audit quality; target: $500–$5,000 average
   - If declining: tool stacks becoming more optimized, or recommendation engine weakening

3. **Share / referral rate** (% of audits resulting in public URL share / click)
   - Measures viral loop; target: 15%+ of completed audits
   - If declining: results not compelling enough, or CTA copy unclear

---

## First instruments to set up

1. **Event tracking** (Vercel Analytics or custom events)
   - `page_viewed`: audit page load (traffic)
   - `form_submitted`: audit form submission
   - `audit_completed`: engine ran successfully
   - `email_captured`: lead submitted email
   - `share_clicked`: user clicked "share this result"

2. **Funnel analysis** (aggregate at weekly intervals)
   - Week 1: 100 visits → 40 audits started → 30 completed → 18 emails → 2–3 shares
   - Track each stage's drop-off

3. **Savings distribution** (histogram)
   - Bin audits into: <$100, $100–$500, $500–$1k, $1k–$5k, >$5k annual savings
   - Monitor median; if skewing toward $0 saves, flag recommendation engine

4. **Lead cohort health** (weekly)
   - Capture rate, email domain (corporate vs. personal), team size distribution
   - Signals quality of leads for Credex sales team

---

## What number triggers a pivot decision

**Pivot trigger 1: Completion rate falls below 50%**
- Action: Review form flow, simplify tool selection, reduce field count
- Investigation: Is it a specific tool causing friction? Mobile layout breaking?

**Pivot trigger 2: Average savings per audit falls below $200 annually**
- Action: Re-audit pricing data; may indicate tool stacks are already optimized (market saturation)
- Investigation: Are founders getting smarter about spend? Is our recommendation logic too conservative?

**Pivot trigger 3: Share rate stays below 5% after first 1k audits**
- Action: Results page UX issue or headline/copy not compelling
- Investigation: Run user interviews; test new CTA copy or result page layout

**Pivot trigger 4: Email capture stays below 40% of completed audits**
- Action: Value not being shown convincingly before email gate
- Investigation: Move email gate later? Strengthen hero savings display?

**Pivot trigger 5: Referral coefficient < 0.1 (shared results generate <10% of new audits)**
- Action: Referral loop isn't working; consider additional channels (Twitter, HN, Product Hunt)
- Investigation: Is public result page compelling enough? Are social previews showing?

---

## Dashboard (sample weekly view)

| Metric | Week 1 | Week 2 | Week 3 | Trend | Target |
|--------|--------|--------|--------|-------|--------|
| **Total audits completed** | 50 | 120 | 280 | ↑ | 500/week |
| **Avg savings per audit** | $650 | $620 | $580 | ↓ | $500+ |
| **Completion rate** | 72% | 74% | 76% | ↑ | 75%+ |
| **Email capture rate** | 58% | 59% | 60% | → | 60%+ |
| **Share rate** | 8% | 11% | 14% | ↑ | 15%+ |
| **Referral audits** | 3 | 15 | 42 | ↑ | 50+ |
| **Consultation bookings*** | 1 | 3 | 7 | ↑ | 10+ |

*Credex-reported; SpendScope sees email captures only.*

---

## Key insights to monitor

- If referral audits growing faster than direct traffic: viral loop is working; invest in results page polish
- If referral audits flat: loop is weak; revisit share mechanics or result page UX
- If consultation bookings growing but savings declining: lower-value leads getting through; tighten high-savings-CTA trigger
- If mobile completion rate < desktop: mobile form UX needs work (priority fix)
