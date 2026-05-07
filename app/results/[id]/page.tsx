import type { Metadata } from "next";
import { ResultsPanel } from "../../../components/results/results-panel";
import { decodeToken } from "../../../lib/token";
import type { AuditResult } from "../../../types/audit";

type ResultsParams = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: ResultsParams }): Promise<Metadata> {
  const { id } = await params;

  try {
    const result = decodeToken<AuditResult>(id);
    return {
      title: `${result.input.companyName} audit`,
      description: `${result.verdict} with ${result.healthScore}/100 health score and ${result.monthlySavings.toFixed(2)} monthly savings.`,
      openGraph: {
        title: `${result.input.companyName} audit`,
        description: result.summary,
      },
    };
  } catch {
    return {
      title: "Shared result",
      description: "Public SpendScope AI share page.",
    };
  }
}

export default async function ResultsPage({ params }: { params: ResultsParams }) {
  const { id } = await params;
  const result = decodeToken<AuditResult>(id);
  const shareUrl = `/results/${encodeURIComponent(id)}`;

  return <ResultsPanel result={result} shareUrl={shareUrl} auditToken={id} mode="share" />;
}