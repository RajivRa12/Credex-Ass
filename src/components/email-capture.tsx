"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ShareActions } from "./share-actions";
import type { AuditResult } from "@/lib/types";

interface EmailCaptureProps {
  result: AuditResult;
  shareUrl: string;
  auditToken: string;
}

type CaptureState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; shareUrl: string; storedInSupabase: boolean; confirmationSent: boolean; warning?: string }
  | { status: "error"; message: string };

export function EmailCapture({ result, shareUrl, auditToken }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<CaptureState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          shareUrl,
          auditToken,
          result: {
            id: result.id,
            companyName: result.input.companyName,
            verdict: result.verdict,
            healthScore: result.healthScore,
            monthlySavings: result.monthlySavings,
            annualSavings: result.annualSavings,
            summary: result.summary,
            useCase: result.input.useCase,
            teamSize: result.input.teamSize,
            currentMonthlySpend: result.currentMonthlySpend,
            recommendedMonthlySpend: result.recommendedMonthlySpend,
          },
        }),
      });

      const payload = (await response.json()) as {
        shareUrl?: string;
        storedInSupabase?: boolean;
        confirmationSent?: boolean;
        warning?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to capture email right now.");
      }

      setState({
        status: "success",
        shareUrl: payload.shareUrl ?? shareUrl,
        storedInSupabase: Boolean(payload.storedInSupabase),
        confirmationSent: Boolean(payload.confirmationSent),
        warning: payload.warning,
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to capture email right now.",
      });
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Email capture</p>
        <h2 className="text-2xl font-semibold text-white">Send the report and unlock the share link</h2>
        <p className="max-w-3xl text-sm leading-6 text-[#9fb1c8]">
          Capture an email, store the audit lead in Supabase, and send a confirmation email before revealing the public URL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex-1 space-y-2">
          <span className="text-sm font-medium text-[#d9e5f2]">Work email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
            placeholder="founder@northstar.ai"
          />
        </label>

        <button
          type="submit"
          disabled={state.status === "loading"}
          className="focus-ring rounded-full bg-[#7bf0c7] px-5 py-3 text-sm font-semibold text-[#07201a] transition hover:bg-[#94f4d2] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state.status === "loading" ? "Sending..." : "Send confirmation"}
        </button>
      </form>

      {state.status === "error" ? (
        <p className="rounded-[18px] border border-[#ff8f9d]/20 bg-[#ff8f9d]/10 px-4 py-3 text-sm text-[#ffd4da]">
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <div className="space-y-4 rounded-[26px] border border-[#7bf0c7]/16 bg-[#7bf0c7]/8 p-5">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-[#bdf8e7]">
            <span>{state.storedInSupabase ? "Stored in Supabase" : "Demo capture"}</span>
            <span>·</span>
            <span>{state.confirmationSent ? "Confirmation email sent" : "Email delivery skipped"}</span>
          </div>
          <p className="text-sm leading-6 text-[#dffdf4]">
            The public result link is now ready.
          </p>
          {state.warning ? <p className="text-sm text-[#ffe8bf]">{state.warning}</p> : null}
          <ShareActions shareUrl={state.shareUrl} />
        </div>
      ) : null}
    </div>
  );
}