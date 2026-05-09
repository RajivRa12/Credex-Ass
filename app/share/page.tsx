import { ResultsPanel } from "../../components/results/results-panel";
import { runAudit } from "../../src/lib/audit";
import { encodeToken } from "../../src/lib/token";
import type { AuditResult, AuditInput } from "../../types/audit";

export const metadata = {
  title: "Example audit | SpendScope AI",
  description: "See an example of a public SpendScope AI audit share.",
};

export default function SharePage() {
  // Generate a demo audit to show what a shared result looks like
  const demoInput: AuditInput = {
    companyName: "Northstar Labs",
    teamSize: 8,
    monthlyBudget: 500,
    useCase: "coding",
    tools: [
      {
        id: "demo-1",
        toolId: "cursor-pro",
        toolName: "Cursor Pro",
        cluster: "code",
        planName: "Pro",
        monthlySpend: 20,
        seats: 8,
        note: "Used by all engineers",
      },
      {
        id: "demo-2",
        toolId: "claude-pro",
        toolName: "Claude Pro",
        cluster: "core-ai",
        planName: "Pro",
        monthlySpend: 20,
        seats: 8,
        note: "Secondary AI assistant",
      },
      {
        id: "demo-3",
        toolId: "github-copilot",
        toolName: "GitHub Copilot",
        cluster: "code",
        planName: "Business",
        monthlySpend: 19,
        seats: 8,
        note: "GitHub integration",
      },
    ],
  };

  const result = runAudit(demoInput) as AuditResult;
  const token = encodeToken(result);
  const shareUrl = `/results/${encodeURIComponent(token)}`;

  return <ResultsPanel result={result} shareUrl={shareUrl} auditToken={token} mode="share" />;
}
