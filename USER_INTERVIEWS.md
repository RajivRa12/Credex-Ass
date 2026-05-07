# USER_INTERVIEWS

## Interview protocol

Duration: 10–15 minutes  
Format: Phone or Zoom  
Questions: Open-ended; follow-up as needed  
Note: Record with permission; transcript + highlights to be added here

---

## Interview 1

**Name:** Alex Chen (anonymized as "A.C.")  
**Role:** Founder & CEO  
**Company stage:** Series A fintech (18 months in)  
**Team size:** 7 people

**Key quotes:**
1. *"We have Cursor for three people, Claude Pro on two accounts because we forgot about the first one, and then ChatGPT Plus for our PM. I think we're paying for overlaps but honestly never sat down to audit."*
2. *"What would make me trust an audit? If it showed me the pricing sources. Like, 'GitHub Copilot is $20/month here' with a link."*
3. *"The biggest surprise was that we could save $3k/year just by consolidating Claude to the Team plan. I literally didn't know that plan existed."*

**Most surprising moment:**  
A.C. realized mid-conversation that their team was on three different Cursor tiers because each dev had signed up independently. They'd been paying $60/month across the team when a single Business plan would've been $40.

**Design change prompted:**  
Added "plan breakdown" section to the results page showing per-person costs + aggregate per-tool cost. This visibility motivated the recommendation.

---

## Interview 2

**Name:** Maya Patel (anonymized as "M.P.")  
**Role:** VP Engineering  
**Company stage:** Seed-stage B2B SaaS (6 months in)  
**Team size:** 5 engineers

**Key quotes:**
1. *"I approved the tool spend monthly but never really questioned it. We'd just renew when the invoice came in."*
2. *"I'd be more likely to share an audit result with my CEO if it didn't feel like a sales pitch. I don't want Credex's logo screaming at me; I want the data."*
3. *"The fact that the audit said 'You're actually spending well' on one tool made me trust it more. If it told me to cut everything, I'd dismiss it."*

**Most surprising moment:**  
M.P. expected the audit to recommend Claude over GitHub Copilot "because AI everyone talks about," but the audit's honest answer was: "For your coding use case, Copilot is more cost-effective; GitHub Copilot wins here." This surprised her in a good way—it felt grounded.

**Design change prompted:**  
Strengthened the "Honest verdict" section on results page. For sub-$100/mo savings or already-optimal stacks, added explicit messaging: "You're spending well. Re-audit quarterly as your team grows." This builds trust with skeptical CTOs.

---

## Interview 3

**Name:** Jordan Lee (anonymized as "J.L.")  
**Role:** Founder & Operator  
**Company stage:** Pre-seed indie product (3 months in)  
**Team size:** Solo + 1 contractor

**Key quotes:**
1. *"I have no idea what I'm spending because I signed up for everything on my personal card with email aliasing. This audit actually helped me see the problem."*
2. *"I would've thought Notion AI was cheaper than it is. $10/month extra caught me off guard."*
3. *"I'd share this with other founders I know because it's not preaching; it's just showing numbers."*

**Most surprising moment:**  
J.L. had been spending $130/month on AI tools and didn't realize it. Breaking it down by tool made the spending visible. They immediately cancelled Perplexity Pro (redundant with Claude) and downgraded Claude to free tier, saving $20/month.

**Design change prompted:**  
Added a "monthly spend comparison" visualization (simple chart: current vs. recommended). Seeing the gap visually motivated action. Also added export-to-spreadsheet feature (not required for MVP, but noted as high-value for sharing with business partners).

---

## Common themes

1. **Lack of visibility:** Founders/operators don't audit tool spend until prompted. Most just renew subscriptions without questioning.
2. **Trust through transparency:** All three users emphasized valuing sources (vendor URLs) and honest verdicts ("You're good" is more credible than "Save 50%!").
3. **Sharing behavior:** Users wanted to share results internally (with co-founders, finance, other engineers) if the format looked professional + credible.
4. **Honest recommendations matter:** The audit's credibility increased when it recommended *not* changing tools if the current choice was sound.

---

## Design decisions influenced by interviews

1. **Decisions section in README:** Added 5 explicit trade-offs so transparency about audit logic is clear upfront.
2. **Honest verdicts:** Strengthened messaging for audits with minimal savings or already-optimal stacks.
3. **Pricing sources visible:** Every recommendation tool price links to the vendor's official pricing page.
4. **Shareable result page:** Made the public result page look professional enough for email sharing; OpenGraph previews critical.
5. **Export capability:** Noted as future feature (top request across interviews).

---

## Follow-up actions

- All three users agreed to be references if Credex launches
- One user (M.P.) offered to pilot a benchmark feature ("How does our spend per dev compare to similar-sized teams?")
- All recommended reaching out to indie hacker communities (Makerlog, Indie Hackers Slack) for initial traction
