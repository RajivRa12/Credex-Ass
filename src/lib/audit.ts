import {
  getCatalogItem,
  getUseCaseRanking,
} from "./pricing";
import type {
  AuditFinding,
  AuditInput,
  AuditRecommendation,
  AuditResult,
  AuditToolInput,
  AuditToolSnapshot,
  ToolCatalogItem,
  ToolCluster,
} from "./types";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function getToolProfile(tool: AuditToolInput) {
  const catalog = getCatalogItem(tool.toolId);
  return {
    catalog,
  };
}

function rankTool(
  tool: AuditToolInput,
  useCase: AuditInput["useCase"],
  cluster: ToolCluster,
) {
  const ranking = getUseCaseRanking(useCase, cluster);
  const index = ranking.indexOf(tool.toolId);
  const baseIndex = index === -1 ? ranking.length + 20 : index;
  return baseIndex * 1000 + tool.monthlySpend;
}

function bestKeeper(
  tools: AuditToolInput[],
  useCase: AuditInput["useCase"],
  cluster: ToolCluster,
) {
  return [...tools].sort((left, right) => {
    const leftRank = rankTool(left, useCase, cluster);
    const rightRank = rankTool(right, useCase, cluster);
    return leftRank - rightRank;
  })[0];
}

function seatTrimSuggestion(tool: AuditToolInput, teamSize: number) {
  const recommendedSeats = Math.max(1, Math.min(tool.seats, teamSize));
  const monthlyPerSeat = tool.seats > 0 ? tool.monthlySpend / tool.seats : tool.monthlySpend;
  const suggestedMonthlySpend = Number((monthlyPerSeat * recommendedSeats).toFixed(2));
  const savings = Math.max(0, Number((tool.monthlySpend - suggestedMonthlySpend).toFixed(2)));

  return {
    recommendedSeats,
    suggestedMonthlySpend,
    savings,
  };
}

function sourceNotes(items: Array<ToolCatalogItem | undefined>) {
  return items
    .filter(Boolean)
    .map((item) => item as ToolCatalogItem)
    .reduce<Array<{ name: string; url: string; note: string }>>((accumulator, item) => {
      if (!accumulator.some((entry) => entry.name === item.name)) {
        accumulator.push({
          name: item.name,
          url: item.sourceUrl,
          note: item.sourceNote,
        });
      }
      return accumulator;
    }, [])
    .slice(0, 6);
}

function buildSummary(
  result: Pick<AuditResult, "monthlySavings" | "input" | "recommendations">,
) {
  if (result.monthlySavings === 0) {
    return `Your current stack is already fairly tight for a ${result.input.teamSize}-person ${result.input.useCase} workflow. The best move is to keep the tools that map cleanly to your day-to-day work and review seats only when the team grows.`;
  }

  const topRecommendation = result.recommendations[0];
  return `You can free up ${formatCurrency(result.monthlySavings)} per month by trimming overlap and moving ${topRecommendation?.title ?? "the highest-cost tool"} to a leaner fit. The current stack still works, but the spend is heavier than the workflow needs.`;
}

export function runAudit(input: AuditInput): AuditResult {
  const normalizedTools = input.tools.map((tool) => ({
    ...tool,
    monthlySpend: Number(tool.monthlySpend.toFixed(2)),
  }));

  const currentMonthlySpend = Number(
    normalizedTools
      .reduce((total, tool) => total + tool.monthlySpend, 0)
      .toFixed(2),
  );

  const snapshots: AuditToolSnapshot[] = [];
  const findings: AuditFinding[] = [];
  const recommendations: AuditRecommendation[] = [];
  let recommendedMonthlySpend = 0;

  const groupedByCluster = normalizedTools.reduce<Record<ToolCluster, AuditToolInput[]>>(
    (accumulator, tool) => {
      if (!accumulator[tool.cluster]) {
        accumulator[tool.cluster] = [];
      }
      accumulator[tool.cluster].push(tool);
      return accumulator;
    },
    {
      "core-ai": [],
      code: [],
      research: [],
      productivity: [],
      custom: [],
    },
  );

  for (const [clusterKey, clusterTools] of Object.entries(groupedByCluster) as Array<
    [ToolCluster, AuditToolInput[]]
  >) {
    if (clusterTools.length === 0) {
      continue;
    }

    const keeper = bestKeeper(clusterTools, input.useCase, clusterKey);

    for (const tool of clusterTools) {
      const profile = getToolProfile(tool);
      const trimmedSeats = seatTrimSuggestion(tool, input.teamSize);
      const isKeeper = tool.id === keeper.id;

      if (isKeeper) {
        recommendedMonthlySpend += trimmedSeats.suggestedMonthlySpend;

        snapshots.push({
          id: tool.id,
          toolName: tool.toolName,
          cluster: tool.cluster,
          planName: tool.planName,
          currentMonthlySpend: tool.monthlySpend,
          suggestedMonthlySpend: trimmedSeats.suggestedMonthlySpend,
          seats: tool.seats,
          recommendedSeats: trimmedSeats.recommendedSeats,
          status: trimmedSeats.savings > 0 ? "downgrade" : "keep",
          rationale:
            trimmedSeats.savings > 0
              ? `Keep this tool, but trim seats to ${trimmedSeats.recommendedSeats} based on your ${input.teamSize}-person team.`
              : `This is the strongest fit in the ${tool.cluster} cluster for your current use case.`,
          sourceUrl: profile.catalog?.sourceUrl,
        });

        if (trimmedSeats.savings > 0) {
          recommendations.push({
            id: `${tool.id}-trim`,
            title: `Trim ${tool.toolName} seats`,
            action: `Reduce seats from ${tool.seats} to ${trimmedSeats.recommendedSeats}`,
            reason: `Your team size is ${input.teamSize}, so the current seat count is larger than needed.`,
            monthlySavings: trimmedSeats.savings,
            priority: "high",
          });

          findings.push({
            id: `${tool.id}-seats`,
            title: `Seat count is above team size`,
            detail: `${tool.toolName} can likely be trimmed to ${trimmedSeats.recommendedSeats} seats without hurting coverage.`,
            severity: "warning",
            savings: trimmedSeats.savings,
          });
        } else {
          findings.push({
            id: `${tool.id}-fit`,
            title: `${tool.toolName} is well matched`,
            detail: `This tool is aligned with your ${input.useCase} workflow and does not show immediate savings.`,
            severity: "positive",
            savings: 0,
          });
        }

        continue;
      }

      snapshots.push({
        id: tool.id,
        toolName: tool.toolName,
        cluster: tool.cluster,
        planName: tool.planName,
        currentMonthlySpend: tool.monthlySpend,
        suggestedMonthlySpend: 0,
        seats: tool.seats,
        recommendedSeats: 0,
        status: "remove",
        rationale: `${tool.toolName} overlaps with ${keeper.toolName} in the same ${tool.cluster} cluster, so it is the lowest-friction cut.`,
        sourceUrl: profile.catalog?.sourceUrl,
      });

      recommendations.push({
        id: `${tool.id}-remove`,
        title: `Remove ${tool.toolName}`,
        action: `Consolidate this cluster around ${keeper.toolName}`,
        reason: `Your stack has overlapping coverage in the ${tool.cluster} category and this tool is not the best fit for the current workflow.`,
        monthlySavings: tool.monthlySpend,
        priority: "high",
      });

      findings.push({
        id: `${tool.id}-duplicate`,
        title: `${tool.toolName} overlaps with a stronger fit`,
        detail: `This spend is duplicating functionality already covered by ${keeper.toolName}.`,
        severity: "warning",
        savings: tool.monthlySpend,
      });
    }
  }

  const budgetGap = Math.max(0, currentMonthlySpend - input.monthlyBudget);
  if (budgetGap > 0) {
    findings.push({
      id: "budget-gap",
      title: "Current spend is above budget",
      detail: `You are spending ${formatCurrency(currentMonthlySpend)} against a target of ${formatCurrency(input.monthlyBudget)}.`,
      severity: "warning",
      savings: budgetGap,
    });
  } else {
    findings.push({
      id: "budget-fit",
      title: "Spend sits inside budget",
      detail: `Your current tool spend stays within the target budget of ${formatCurrency(input.monthlyBudget)}.`,
      severity: "positive",
      savings: 0,
    });
  }

  const recommendedRounded = Number(recommendedMonthlySpend.toFixed(2));
  const monthlySavings = Number(Math.max(0, currentMonthlySpend - recommendedRounded).toFixed(2));
  const annualSavings = Number((monthlySavings * 12).toFixed(2));
  const duplicateCount = snapshots.filter((snapshot) => snapshot.status === "remove").length;
  const trimmedCount = snapshots.filter((snapshot) => snapshot.status === "downgrade").length;

  const savingsRatio = currentMonthlySpend > 0 ? monthlySavings / currentMonthlySpend : 0;
  const healthScore = clamp(
    Math.round(96 - savingsRatio * 55 - duplicateCount * 6 - trimmedCount * 2),
    41,
    98,
  );

  const verdict =
    monthlySavings === 0
      ? "Already optimized"
      : monthlySavings / Math.max(1, currentMonthlySpend) > 0.25
        ? "High savings opportunity"
        : "Moderate optimization opportunity";

  recommendations.sort((left, right) => right.monthlySavings - left.monthlySavings);
  findings.sort((left, right) => right.savings - left.savings);

  const summary = buildSummary({
    monthlySavings,
    input,
    recommendations,
  });

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    summary,
    verdict,
    healthScore,
    currentMonthlySpend,
    recommendedMonthlySpend: recommendedRounded,
    monthlySavings,
    annualSavings,
    toolSnapshots: snapshots,
    findings,
    recommendations,
    sourceNotes: sourceNotes(
      normalizedTools
        .map((tool) => getCatalogItem(tool.toolId))
        .filter(Boolean) as ToolCatalogItem[],
    ),
  };
}

export function createDefaultAuditInput(): AuditInput {
  return {
    companyName: "Northstar Labs",
    teamSize: 4,
    monthlyBudget: 180,
    useCase: "coding",
    tools: [
      {
        id: crypto.randomUUID(),
        toolId: "cursor-pro",
        toolName: "Cursor Pro",
        cluster: "code",
        planName: "Pro",
        monthlySpend: 20,
        seats: 1,
        note: "Primary coding assistant",
      },
      {
        id: crypto.randomUUID(),
        toolId: "claude-pro",
        toolName: "Claude Pro",
        cluster: "core-ai",
        planName: "Pro",
        monthlySpend: 20,
        seats: 1,
        note: "Writing and synthesis",
      },
    ],
  };
}