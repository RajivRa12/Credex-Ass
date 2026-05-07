import test from "node:test";
import assert from "node:assert/strict";
import { formatMoney } from "../lib/calculations";

test("formatMoney formats USD", () => {
  assert.equal(formatMoney(20), "$20");
});