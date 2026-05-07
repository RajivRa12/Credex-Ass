import Link from "next/link";
import { EmailCapture } from "./email-capture";
import type { AuditResult } from "@/lib/types";

interface ResultsPanelProps {
  result: AuditResult;
  shareUrl: string;
  auditToken: string;
  mode?: "results" | "share";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function badgeStyle(severity: string) {
  if (severity === "positive") {
    return "border-[#7bf0c7]/20 bg-[#7bf0c7]/10 text-[#d7fff0]";
  }

  if (severity === "warning") {
    return "border-[#ffd08a]/18 bg-[#ffd08a]/10 text-[#ffe8bf]";
  }

  return "border-white/10 bg-white/6 text-[#d7e6fa]";
}

function statusLabel(status: string) {
  if (status === "keep") return "Keep";
  if (status === "downgrade") return "Trim seats";
  return "Remove";
}

export function ResultsPanel({ result, shareUrl, auditToken, mode = "results" }: ResultsPanelProps) {
  return (
    <section className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="pill">{mode === "share" ? "Public share" : "Audit complete"}</span>
            <h1 className="section-title max-w-4xl font-semibold text-white">
              {mode === "share"
                ? `${result.input.companyName} on SpendScope AI`
                : `A clear read on ${result.input.companyName}'s tool spend.`}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#9fb1c8] sm:text-lg">
              Honest savings, explainable recommendations, and a public result page that feels built for a real startup review.
            </p>
          </div>

          <div className="glass-panel-strong gradient-border relative w-full max-w-xs rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-[#9fb1c8]">Health score</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-6xl font-semibold tracking-[-0.08em] text-white">{result.healthScore}</span>
              <span className="pb-2 text-sm text-[#9fb1c8]">/100</span>
            </div>
            <p className="mt-3 text-sm text-[#dffdf4]">{result.verdict}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Current monthly spend", value: formatCurrency(result.currentMonthlySpend) },
            { label: "Recommended spend", value: formatCurrency(result.recommendedMonthlySpend) },
            { label: "Estimated annual savings", value: formatCurrency(result.annualSavings) },
          ].map((item) => (
            <div key={item.label} className="glass-panel rounded-[24px] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="glass-panel-strong rounded-[28px] p-5 sm:p-6">
          <EmailCapture result={result} shareUrl={shareUrl} auditToken={auditToken} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel-strong rounded-[28px] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Why this result matters</h2>
              </div>
              <p className="mono text-sm text-[#9fb1c8]">
                {formatCurrency(result.monthlySavings)} monthly savings
              </p>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#d9e5f2] sm:text-lg">{result.summary}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {result.recommendations.slice(0, 2).map((recommendation) => (
                <article key={recommendation.id} className="rounded-[22px] border border-white/8 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9fb1c8]">Priority {recommendation.priority}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{recommendation.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#9fb1c8]">{recommendation.reason}</p>
                  <p className="mt-3 text-sm font-medium text-[#dffdf4]">{recommendation.action}</p>
                  <p className="mt-2 mono text-sm text-[#78f0c7]">Save {formatCurrency(recommendation.monthlySavings)} / month</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel rounded-[28px] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Quick action</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Share unlocks after email capture</h2>
              <p className="mt-3 text-sm leading-6 text-[#9fb1c8]">
                The public link is generated from the encoded audit result, but the copy action stays hidden until the email step is completed.
              </p>
            </div>

            <div className="glass-panel rounded-[28px] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Tool snapshots</p>
              <div className="mt-4 space-y-3">
                {result.toolSnapshots.map((snapshot) => (
                  <article key={snapshot.id} className="rounded-[20px] border border-white/8 bg-white/4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-white">{snapshot.toolName}</h3>
                        <p className="mt-1 text-sm text-[#9fb1c8]">{snapshot.planName} · {snapshot.cluster}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/85">
                        {statusLabel(snapshot.status)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#d9e5f2]">{snapshot.rationale}</p>
                    <p className="mt-3 mono text-sm text-[#78f0c7]">
                      {formatCurrency(snapshot.currentMonthlySpend)} → {formatCurrency(snapshot.suggestedMonthlySpend)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Findings</p>
            <div className="mt-4 space-y-3">
              {result.findings.map((finding) => (
                <article key={finding.id} className="rounded-[20px] border border-white/8 bg-white/4 p-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeStyle(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-white">{finding.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#9fb1c8]">{finding.detail}</p>
                  <p className="mt-3 mono text-sm text-[#dffdf4]">Potential impact {formatCurrency(finding.savings)}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Source notes</p>
            <p className="mt-3 text-sm leading-6 text-[#9fb1c8]">
              The pricing model uses published pricing pages as the source of truth. The audit keeps the logic deterministic so it can be reviewed by a founder or operator.
            </p>
            <div className="mt-4 space-y-3">
              {result.sourceNotes.map((source) => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[18px] border border-white/8 bg-white/4 p-4 transition hover:border-white/16 hover:bg-white/6"
                >
                  <p className="text-base font-semibold text-white">{source.name}</p>
                  <p className="mt-1 text-sm text-[#9fb1c8]">{source.note}</p>
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-[20px] border border-[#7bf0c7]/16 bg-[#7bf0c7]/8 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-[#bdf8e7]">Audit context</p>
              <p className="mt-2 text-sm leading-6 text-[#dffdf4]">
                {result.input.companyName} · {result.input.teamSize} seats · {result.input.useCase} workflow
              </p>
            </div>
          </div>
        </div>

        {mode === "share" ? null : (
          <div className="flex flex-wrap gap-3">
            <Link
              href="/audit"
              className="focus-ring rounded-full border border-white/12 bg-white/5 px-4 py-3 text-sm font-medium text-[#dce8f5] transition hover:border-white/18 hover:bg-white/10"
            >
              Audit another stack
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}