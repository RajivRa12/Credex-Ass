import test from "node:test";
import assert from "node:assert/strict";
import { getCatalogCopy } from "../lib/pricing";

test("pricing catalog has entries", () => {
  assert.ok(getCatalogCopy().length > 0);
});