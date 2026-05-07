import test from "node:test";
import assert from "node:assert/strict";
import { createDefaultAuditInput, runAudit } from "../lib/audit-engine";
import type { AuditInput } from "../lib/types";

function buildInput(overrides?: Partial<AuditInput>): AuditInput {
  return {
    companyName: "Acme Labs",
    teamSize: 4,
    monthlyBudget: 120,
    useCase: "coding",
    tools: [
      {
        id: "tool-1",
        toolId: "cursor-pro",
        toolName: "Cursor Pro",
        cluster: "code",
        planName: "Pro",
        monthlySpend: 20,
        seats: 1,
      },
      {
        id: "tool-2",
        toolId: "claude-pro",
        toolName: "Claude Pro",
        cluster: "core-ai",
        planName: "Pro",
        monthlySpend: 20,
        seats: 1,
      },
    ],
    ...overrides,
  };
}

test("returns structured result with stable fields", () => {
  const result = runAudit(createDefaultAuditInput());
  assert.equal(typeof result.summary, "string");
  assert.ok(result.healthScore >= 41 && result.healthScore <= 98);
  assert.equal(result.annualSavings, Number((result.monthlySavings * 12).toFixed(2)));
});

test("flags overlap when two tools are in the same cluster", () => {
  const result = runAudit(
    buildInput({
      useCase: "coding",
      tools: [
        {
          id: "ai-1",
          toolId: "chatgpt-plus",
          toolName: "ChatGPT Plus",
          cluster: "core-ai",
          planName: "Plus",
          monthlySpend: 20,
          seats: 1,
        },
        {
          id: "ai-2",
          toolId: "claude-pro",
          toolName: "Claude Pro",
          cluster: "core-ai",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
        },
      ],
    }),
  );

  assert.ok(result.toolSnapshots.some((snapshot) => snapshot.status === "remove"));
  assert.ok(result.recommendations.some((rec) => rec.title.startsWith("Remove")));
  assert.ok(result.monthlySavings > 0);
});

test("recommends seat trimming when seats exceed team size", () => {
  const result = runAudit(
    buildInput({
      teamSize: 3,
      tools: [
        {
          id: "code-1",
          toolId: "cursor-pro",
          toolName: "Cursor Pro",
          cluster: "code",
          planName: "Pro",
          monthlySpend: 80,
          seats: 8,
        },
      ],
    }),
  );

  const snapshot = result.toolSnapshots[0];
  assert.equal(snapshot.status, "downgrade");
  assert.equal(snapshot.recommendedSeats, 3);
  assert.ok(result.recommendations.some((rec) => rec.title.includes("Trim")));
});

test("adds budget warning when spend exceeds budget", () => {
  const result = runAudit(
    buildInput({
      monthlyBudget: 10,
      tools: [
        {
          id: "code-1",
          toolId: "cursor-pro",
          toolName: "Cursor Pro",
          cluster: "code",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
        },
      ],
    }),
  );

  assert.ok(result.findings.some((finding) => finding.id === "budget-gap"));
});

test("returns already optimized verdict when no savings exist", () => {
  const result = runAudit(
    buildInput({
      teamSize: 4,
      monthlyBudget: 100,
      tools: [
        {
          id: "code-1",
          toolId: "cursor-pro",
          toolName: "Cursor Pro",
          cluster: "code",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
        },
      ],
    }),
  );

  assert.equal(result.monthlySavings, 0);
  assert.equal(result.verdict, "Already optimized");
});