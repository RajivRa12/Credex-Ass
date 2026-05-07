import { NextResponse } from "next/server";
import { createDefaultAuditInput, runAudit } from "../../../lib/audit-engine";
import { encodeToken } from "../../../lib/token";
import type { AuditInput } from "../../../types/audit";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Partial<AuditInput>;
  const input = {
    ...createDefaultAuditInput(),
    ...payload,
  } satisfies AuditInput;

  const result = runAudit(input);
  const token = encodeToken(result);

  return NextResponse.json({
    result,
    token,
    shareUrl: `/results/${encodeURIComponent(token)}`,
  });
}