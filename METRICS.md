# METRICS

## North Star Metric

**Qualified audits completed per week**

Qualified means the audit finishes and surfaces at least one meaningful action, either a savings opportunity worth more than $100/year or an explicit "you’re spending well" verdict that still builds trust.

Why this metric:
- It measures whether the product is actually helping users, not just attracting clicks.
- It matches a B2B lead-gen tool that is used episodically, not daily.
- It protects against vanity growth: high traffic with weak audits would not move this number.
- It correlates with downstream lead quality for Credex because stronger audits are more likely to be shared or gated.

Rejected alternatives:
- DAU, because users will not open this every day.
- Raw page views, because traffic can rise without any useful audit being completed.
- Emails captured, because that is a later-stage conversion and can hide weak product quality.

## Three input metrics

1. **Audit completion rate**: form starts that turn into completed audits.
   - Target: 70%+.
   - If this falls, the form is too long, too confusing, or the pricing data is not trusted.

2. **Average annual savings per completed audit**: the mean savings value surfaced by the engine.
   - Target: $500+ average for the audience we are targeting.
   - If this falls, the recommendation logic may be too conservative or the market may be less wasteful than assumed.

3. **Share rate**: completed audits that are shared via public URL or forwarded internally.
   - Target: 10%+ initially, then 15%+ once the result page is polished.
   - If this falls, the results page is not compelling enough to circulate.

## What I’d instrument first

I would instrument the smallest set of events that tells the story of the funnel: `audit_started`, `audit_completed`, `email_captured`, `share_clicked`, and `consultation_cta_clicked`. Those events let me separate product friction from product value. I would also log the savings band for each audit so I can see whether users mostly get low-value outcomes or genuinely useful ones.

The first dashboard I would build is a weekly funnel with one line for completion rate, one for average savings, and one for share rate. That gives a compact view of whether the product is getting better or just getting busier.

## Pivot trigger

I would consider a pivot if either of these happens:
- Completion rate stays below 50% for two consecutive weeks.
- Average savings per completed audit stays below $200/year after the first 1,000 completed audits.

Those thresholds mean the product is not delivering enough visible value to justify a lead-gen motion. At that point I would simplify the form, revisit the pricing assumptions, or narrow the target persona.
