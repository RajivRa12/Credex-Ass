import test from "node:test";
import assert from "node:assert/strict";
import { createDefaultAuditInput, runAudit } from "../lib/audit-engine";

test("audit engine returns a tokenized result", () => {
  const result = runAudit(createDefaultAuditInput());
  assert.equal(typeof result.summary, "string");
  assert.ok(result.healthScore > 0);
});