import { NextResponse } from "next/server";
import { runAudit } from "../../../lib/audit-engine";
import type { AuditInput } from "../../../types/audit";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Partial<AuditInput>;
  const result = runAudit({
    companyName: payload.companyName ?? "Northstar Labs",
    teamSize: payload.teamSize ?? 4,
    monthlyBudget: payload.monthlyBudget ?? 180,
    useCase: payload.useCase ?? "coding",
    tools: payload.tools ?? [],
  });

  return NextResponse.json({ summary: result.summary });
}