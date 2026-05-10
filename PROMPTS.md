# PROMPTS

The full LLM prompts used in the tool, plus why they were written this way and what did not work.

## Deterministic Summary Prompt (Current Implementation)

The MVP uses templated summaries rather than live LLM calls. This prompt describes the logic:

```
Given the audit result object (tools, savings, recommendations, verdict), 
generate a 100-word founder-friendly paragraph that:

1. Opens with the top savings opportunity
2. Mentions overlapping tools if detected
3. Suggests one key action (downgrade, switch, or consolidate)
4. Closes with the total annual savings and encouragement

Tone: Direct, non-patronizing, evidence-based. Never invent savings.

Template structure:
"Your team is currently spending [$current/mo] on AI tools. We found [savings/mo] 
in potential savings, primarily by [action]. Specifically, [tool] at [plan] costs 
[$cost], and you could [recommendation] for [$new_cost], saving [$delta]. Overall, 
this audit suggests [$annual_savings]/year in optimization. Here's what to focus on..."
```

**Why deterministic for MVP:**
- Reproduces consistently (Finance teams like deterministic explanations)
- No API latency (millisecond generation vs. 1–2s for LLM)
- No cost (saves ~$500/month in API calls at 10k audits/month scale)
- Fallback if LLM API is down (no critical path dependency)

---

## Future: LLM Summary Prompt (Anthropic API)

When live LLM integration is enabled, this prompt will replace the deterministic summary:

```
You are an AI infrastructure consultant writing a brief executive summary of a 
business's AI tool spend audit.

Given the following audit results, write a personalized 100-word paragraph for a 
founder or engineering manager.

Audit results:
- Current monthly spend: $[amount]
- Team size: [size]
- Primary use case: [use case]
- Tools identified: [list]
- Overlapping tools: [list or none]
- Savings opportunity: $[monthly] / $[annual]
- Top recommendations:
  1. [action 1] → $[savings]
  2. [action 2] → $[savings]
  3. [action 3] → $[savings]

Write a summary that:
1. Acknowledges their current spend level (not judgmental)
2. Highlights the single biggest savings opportunity
3. Explains why it matters for their team size / use case
4. Recommends one immediate action
5. Closes with confidence ("You're in good shape" or "Quick wins available")

Constraints:
- ~100 words
- No buzzwords; use plain language
- Never exaggerate savings
- Cite the tool names and specific plans mentioned above
- If savings < $100/month, acknowledge they're optimized and suggest re-auditing next quarter
```

**Why this prompt:**
- Personalized language (better than template for viral potential)
- Acknowledges the user's situation (more consultative tone)
- Specific constraints (100 words keeps it scannable)
- Safety guardrails (never exaggerate, cite sources)

---

## What I tried that didn't work

1. **"Just generate good advice" prompt**
   - Too open-ended; LLM would invent recommendations not backed by the audit data
   - Result: "You should consider upgrading to Claude Team" when audit data didn't support it
   - Fixed by adding explicit constraints + audit data injection

2. **Asking LLM to pick "best" tool for use case**
   - LLM would favor Claude or GPT because they're training data defaults
   - Result: "Claude is better for coding" (true in general, but ignored their existing tooling)
   - Fixed by: keeping deterministic engine for recommendations; LLM only writes summary of existing recommendations

3. **"Write a viral tweet about their savings"**
   - Too salesy; founder audience found it inauthentic
   - Result: "Just saved $12k/year thanks to @SpendScopeAI! 🚀" — seemed templated
   - Fixed by: scoping LLM to honest, boring summary language (not marketing copy)

4. **One-prompt full audit generation**
   - Wanted LLM to do the whole audit from spend data
   - Result: LLM invented savings ("You could switch to open-source alternatives" without knowing costs)
   - Fixed by: Keeping audit engine deterministic (rules-based); LLM only summarizes the results

---

## Error handling

If Anthropic API fails:
1. Log error to Sentry (if monitoring enabled)
2. Return fallback templated summary (deterministic version)
3. Show message: "Unable to generate personalized summary; showing automated insights"
4. No user-facing error; audit results still displayed

This pattern keeps the feature gracefully degradable.

---

## Testing the prompts

Before enabling live LLM:
1. Generate summaries for 10 audits with known outcomes
2. Have founder review for accuracy (are recommendations sound?)
3. Check word count (should be ~100, not 200+)
4. Verify no savings are exaggerated
5. A/B test LLM vs. templated on engagement (email open rate, share rate)
