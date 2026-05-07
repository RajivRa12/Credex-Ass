# TESTS

## Overview

Tests cover the core audit engine logic, pricing calculations, recommendations generation, and API routes. All tests are designed to run deterministically without external dependencies.

---

## Test files

### 1. **tests/audit-engine.test.ts**
**What it covers:** Core audit logic, savings calculations, verdict generation  
**Key test cases:**
- Audit with single tool → correct savings calculated
- Audit with overlapping tools → detected and flagged
- Audit with team size mismatch → seat trim recommended (e.g., Team plan for 2 people)
- Audit with >$500/mo savings → Credex CTA flagged
- Audit with <$100/mo savings → honest verdict ("You're spending well")
- Audit with no tools → returns default (no error)

**Example test:**
```typescript
test('detects overlapping tools and recommends consolidation', () => {
  const input = {
    tools: [
      { name: 'ChatGPT Plus', spend: 20 },
      { name: 'Claude Pro', spend: 20 },
    ],
    teamSize: 1,
  };
  const result = runAudit(input);
  expect(result.findings).toContainEqual(
    expect.objectContaining({ type: 'overlap', tools: ['ChatGPT Plus', 'Claude Pro'] })
  );
  expect(result.monthlySavings).toBeGreaterThan(0);
});
```

**Run:** `npm run test -- audit-engine.test.ts`

---

### 2. **tests/calculations.test.ts**
**What it covers:** Math utilities (currency formatting, percentages, seat calculations)  
**Key test cases:**
- Format $1234.56 → "$1,234.56"
- Calculate seat cost: $100 team plan / 5 people = $20 per person
- Percentage discount: 10% off $50 = $45
- Annual rollup: $50/mo × 12 = $600/year
- Savings percentage: ($100 current - $60 recommended) / $100 = 40% reduction

**Run:** `npm run test -- calculations.test.ts`

---

### 3. **tests/recommendations.test.ts**
**What it covers:** Recommendation rule generation  
**Key test cases:**
- For Cursor Pro at $20/mo for 5 people: recommend Cursor Hobby at $0 (free tier) → save $100/mo
- For GitHub Copilot Business at $105/mo for 3 people: recommend Individual at $30/mo → save $75/mo
- For Claude Pro + ChatGPT Plus on same team: recommend Claude Team at $30/seat → save depending on team size
- For high spend + small team: recommend consolidation rule
- For API direct users: recommend switching to subscription if usage is predictable

**Run:** `npm run test -- recommendations.test.ts`

---

### 4. **tests/pricing.test.ts**
**What it covers:** Pricing catalog data integrity  
**Key test cases:**
- All tools in catalog have: name, tiers (plans), pricing per tier
- All pricing values are positive numbers
- All pricing sources have vendor URLs
- No duplicate tool entries
- Sample audit with catalog tools produces non-zero results

**Run:** `npm run test -- pricing.test.ts`

---

### 5. **tests/api.test.ts**
**What it covers:** API route smoke tests  
**Key test cases:**
- POST `/api/email` with valid email → returns 200 + share URL
- POST `/api/email` with invalid email → returns 400 + error message
- POST `/api/email` with missing required fields → returns 400
- GET `/api/audit/[id]` with valid token → returns 200 + audit data (if implemented)
- POST `/api/share` with result object → returns 200 + public URL

**Run:** `npm run test -- api.test.ts`

---

## Test runner setup

### Current state
The project runs tests using **Node's built-in test runner** with `tsx` for TypeScript execution.

```bash
npm run test
```

This executes all files in `tests/*.test.ts`.

---

## CI/CD integration

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to main:
```yaml
- run: npm run lint
- run: npm run build
- run: npm run test
```

Tests are now part of the expected CI path.

---

## Coverage goals

| Module | Target | Status |
|--------|--------|--------|
| **Audit engine** | 80%+ | ✅ 5+ tests covering core paths |
| **Calculations** | 90%+ | ✅ Tests for all math utilities |
| **Recommendations** | 75%+ | ✅ Rule matrix tested |
| **Pricing** | 100% | ✅ Data integrity validated |
| **API routes** | 70%+ | ⚠️ Smoke tests only (full integration deferred) |

---

## Running all tests locally

```bash
npm run test

# With coverage report:
npm run test -- --coverage

# Watch mode (re-run on file changes):
npm run test -- --watch
```

---

## Test data fixtures

Sample audit inputs for testing:

```typescript
// Startup with overlapping tools
const seedAudit = {
  tools: [
    { name: 'ChatGPT Plus', plan: 'Plus', spend: 20, seats: 1 },
    { name: 'Claude Pro', plan: 'Pro', spend: 20, seats: 1 },
    { name: 'GitHub Copilot', plan: 'Individual', spend: 10, seats: 3 },
  ],
  teamSize: 3,
  useCase: 'coding',
};

// Large team with seat underutilization
const largeTeamAudit = {
  tools: [
    { name: 'ChatGPT', plan: 'Team', spend: 300, seats: 5 },
  ],
  teamSize: 10,
  useCase: 'mixed',
};

// Already optimized
const optimizedAudit = {
  tools: [
    { name: 'GitHub Copilot', plan: 'Business', spend: 50, seats: 5 },
  ],
  teamSize: 5,
  useCase: 'coding',
};
```

---

## Debugging failed tests

1. **Audit engine test fails:** Check `lib/audit-engine.ts` for logic errors or pricing changes
2. **Pricing test fails:** Verify all tools in `lib/pricing.ts` have complete data
3. **Calculations fail:** Check math utility functions in `lib/calculations.ts`
4. **API test fails:** Ensure Supabase/Resend stub implementations are present

Use `npm run build` to validate TypeScript compilation before running tests.

---

## Next steps

- [x] Ensure all 5 test files pass
- [ ] Add coverage reporting badge to README
- [ ] Add integration tests for Supabase + Resend (currently stubbed)
