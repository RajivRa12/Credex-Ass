import type { ToolCatalogItem, ToolCluster, UseCase } from "./types";

export const TOOL_CATALOG: ToolCatalogItem[] = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    cluster: "core-ai",
    planName: "Plus",
    monthlyPrice: 20,
    sourceUrl: "https://openai.com/chatgpt/pricing/",
    sourceNote: "Consumer plan used as a lightweight baseline for solo operators.",
    bestFor: "quick drafting, general brainstorming, and light analysis",
  },
  {
    id: "chatgpt-team",
    name: "ChatGPT Team",
    cluster: "core-ai",
    planName: "Team",
    monthlyPrice: 30,
    sourceUrl: "https://openai.com/chatgpt/pricing/",
    sourceNote: "Team-tier pricing is treated as a per-seat monthly baseline.",
    bestFor: "shared team workflows and admin controls",
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    cluster: "core-ai",
    planName: "Pro",
    monthlyPrice: 20,
    sourceUrl: "https://www.anthropic.com/pricing",
    sourceNote: "Solo premium plan used as a strong writing-first comparator.",
    bestFor: "drafting, synthesis, and balanced reasoning",
  },
  {
    id: "gemini-advanced",
    name: "Gemini Advanced",
    cluster: "core-ai",
    planName: "Advanced",
    monthlyPrice: 19.99,
    sourceUrl: "https://one.google.com/about/google-ai-plans/",
    sourceNote: "Google AI plan baseline used for broad assistant coverage.",
    bestFor: "workspace-friendly general assistant work",
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    cluster: "research",
    planName: "Pro",
    monthlyPrice: 20,
    sourceUrl: "https://www.perplexity.ai/pro",
    sourceNote: "Research-first plan used as the discovery benchmark.",
    bestFor: "search-heavy research and cited answers",
  },
  {
    id: "cursor-pro",
    name: "Cursor Pro",
    cluster: "code",
    planName: "Pro",
    monthlyPrice: 20,
    sourceUrl: "https://cursor.com/pricing",
    sourceNote: "Editor-centric baseline for product engineers.",
    bestFor: "coding inside the editor with context-aware assistance",
  },
  {
    id: "copilot-pro",
    name: "GitHub Copilot Pro",
    cluster: "code",
    planName: "Pro",
    monthlyPrice: 10,
    sourceUrl: "https://github.com/features/copilot",
    sourceNote: "Lower-cost coding alternative for individual contributors.",
    bestFor: "inline completion and lighter engineering workflows",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    cluster: "productivity",
    planName: "AI add-on",
    monthlyPrice: 10,
    sourceUrl: "https://www.notion.com/product/ai",
    sourceNote: "Productivity add-on used as a documentation baseline.",
    bestFor: "docs, summaries, and lightweight team workflows",
  },
];

const PRESET_ORDER: Record<UseCase, Record<ToolCluster, string[]>> = {
  coding: {
    "core-ai": ["claude-pro", "chatgpt-plus", "gemini-advanced", "perplexity-pro"],
    code: ["cursor-pro", "copilot-pro"],
    research: ["perplexity-pro", "claude-pro", "chatgpt-plus"],
    productivity: ["notion-ai"],
    custom: [],
  },
  writing: {
    "core-ai": ["claude-pro", "chatgpt-plus", "gemini-advanced", "perplexity-pro"],
    code: ["copilot-pro", "cursor-pro"],
    research: ["perplexity-pro", "claude-pro", "chatgpt-plus"],
    productivity: ["notion-ai"],
    custom: [],
  },
  research: {
    "core-ai": ["chatgpt-plus", "claude-pro", "gemini-advanced"],
    code: ["copilot-pro", "cursor-pro"],
    research: ["perplexity-pro", "chatgpt-plus", "claude-pro"],
    productivity: ["notion-ai"],
    custom: [],
  },
  general: {
    "core-ai": ["chatgpt-plus", "claude-pro", "gemini-advanced"],
    code: ["copilot-pro", "cursor-pro"],
    research: ["perplexity-pro", "chatgpt-plus"],
    productivity: ["notion-ai"],
    custom: [],
  },
};

export function getCatalogItem(toolId: string) {
  return TOOL_CATALOG.find((tool) => tool.id === toolId);
}

export function getUseCaseRanking(useCase: UseCase, cluster: ToolCluster) {
  return PRESET_ORDER[useCase][cluster] ?? [];
}

export function getCatalogCopy() {
  return TOOL_CATALOG.map((tool) => ({
    value: tool.id,
    label: tool.name,
    category: tool.cluster,
    helper: tool.bestFor,
    price: tool.monthlyPrice,
  }));
}