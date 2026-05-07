export type UseCase = "coding" | "writing" | "research" | "general";
export type ToolCluster = "core-ai" | "code" | "research" | "productivity" | "custom";

export interface ToolCatalogItem {
  id: string;
  name: string;
  cluster: ToolCluster;
  planName: string;
  monthlyPrice: number;
  sourceUrl: string;
  sourceNote: string;
  bestFor: string;
}

export interface AuditToolInput {
  id: string;
  toolId: string;
  toolName: string;
  cluster: ToolCluster;
  planName: string;
  monthlySpend: number;
  seats: number;
  note?: string;
}

export interface AuditInput {
  companyName: string;
  teamSize: number;
  monthlyBudget: number;
  useCase: UseCase;
  tools: AuditToolInput[];
}

export interface AuditToolSnapshot {
  id: string;
  toolName: string;
  cluster: ToolCluster;
  planName: string;
  currentMonthlySpend: number;
  suggestedMonthlySpend: number;
  seats: number;
  recommendedSeats: number;
  status: "keep" | "downgrade" | "remove";
  rationale: string;
  sourceUrl?: string;
}

export interface AuditFinding {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warning" | "positive";
  savings: number;
}

export interface AuditRecommendation {
  id: string;
  title: string;
  action: string;
  reason: string;
  monthlySavings: number;
  priority: "high" | "medium" | "low";
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  summary: string;
  verdict: string;
  healthScore: number;
  currentMonthlySpend: number;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  toolSnapshots: AuditToolSnapshot[];
  findings: AuditFinding[];
  recommendations: AuditRecommendation[];
  sourceNotes: Array<{ name: string; url: string; note: string }>;
}