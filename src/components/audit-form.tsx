"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDefaultAuditInput,
  runAudit,
} from "@/lib/audit";
import { encodeToken } from "@/lib/token";
import { getCatalogCopy, getCatalogItem } from "@/lib/pricing";
import type { AuditInput, AuditToolInput, UseCase } from "@/lib/types";

const STORAGE_KEY = "spendscope:draft:v1";

function createRow(toolId: string = "cursor-pro"): AuditToolInput {
  const preset = getCatalogItem(toolId);
  return {
    id: crypto.randomUUID(),
    toolId: preset?.id ?? toolId,
    toolName: preset?.name ?? "Custom tool",
    cluster: preset?.cluster ?? "custom",
    planName: preset?.planName ?? "Custom",
    monthlySpend: preset?.monthlyPrice ?? 0,
    seats: 1,
    note: preset?.bestFor ?? "",
  };
}

function readDraft() {
  if (typeof window === "undefined") {
    return createDefaultAuditInput();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return createDefaultAuditInput();
  }

  try {
    return JSON.parse(stored) as AuditInput;
  } catch {
    return createDefaultAuditInput();
  }
}

export function AuditForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<AuditInput>(createDefaultAuditInput());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setForm(readDraft());
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form, mounted]);

  const totalSpend = useMemo(
    () => form.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0),
    [form.tools],
  );

  function updateField<K extends keyof AuditInput>(key: K, value: AuditInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateTool(id: string, patch: Partial<AuditToolInput>) {
    setForm((current) => ({
      ...current,
      tools: current.tools.map((tool) => (tool.id === id ? { ...tool, ...patch } : tool)),
    }));
  }

  function addTool() {
    setForm((current) => ({ ...current, tools: [...current.tools, createRow()] }));
  }

  function removeTool(id: string) {
    setForm((current) => ({
      ...current,
      tools: current.tools.length > 1 ? current.tools.filter((tool) => tool.id !== id) : current.tools,
    }));
  }

  function setPreset(toolId: string, rowId: string) {
    const preset = getCatalogItem(toolId);
    if (!preset) {
      updateTool(rowId, {
        toolId: "custom",
        toolName: "Custom tool",
        cluster: "custom",
        planName: "Custom",
        monthlySpend: 0,
        seats: 1,
      });
      return;
    }

    updateTool(rowId, {
      toolId: preset.id,
      toolName: preset.name,
      cluster: preset.cluster,
      planName: preset.planName,
      monthlySpend: preset.monthlyPrice,
      seats: 1,
      note: preset.bestFor,
    });
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = runAudit(form);
    const token = encodeToken(result);
    router.push(`/results/${encodeURIComponent(token)}`);
  }

  return (
    <form onSubmit={submitForm} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#d9e5f2]">Company name</span>
          <input
            required
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
            placeholder="Northstar Labs"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[#d9e5f2]">Team size</span>
          <input
            min={1}
            max={500}
            required
            type="number"
            value={form.teamSize}
            onChange={(event) => updateField("teamSize", Number(event.target.value) || 1)}
            className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
            placeholder="4"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[#d9e5f2]">Monthly budget</span>
          <input
            min={0}
            step="0.01"
            required
            type="number"
            value={form.monthlyBudget}
            onChange={(event) => updateField("monthlyBudget", Number(event.target.value) || 0)}
            className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
            placeholder="180"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[#d9e5f2]">Primary workflow</span>
          <select
            value={form.useCase}
            onChange={(event) => updateField("useCase", event.target.value as UseCase)}
            className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          >
            <option value="coding">Coding</option>
            <option value="writing">Writing</option>
            <option value="research">Research</option>
            <option value="general">General ops</option>
          </select>
        </label>
      </div>

      <div className="glass-panel-strong rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Tools</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">List the tools you actually pay for</h2>
          </div>
          <button
            type="button"
            onClick={addTool}
            className="focus-ring rounded-full border border-white/12 bg-white/5 px-4 py-3 text-sm font-medium text-[#dce8f5] transition hover:border-white/18 hover:bg-white/10"
          >
            Add tool
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {form.tools.map((tool, index) => (
            <div key={tool.id} className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Tool {index + 1}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{tool.toolName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeTool(tool.id)}
                  className="focus-ring self-start rounded-full border border-white/12 px-3 py-2 text-sm text-[#dce8f5] transition hover:bg-white/8"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-2 xl:col-span-2">
                  <span className="text-sm text-[#d9e5f2]">Preset</span>
                  <select
                    value={tool.toolId}
                    onChange={(event) => setPreset(event.target.value, tool.id)}
                    className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                  >
                    {getCatalogCopy().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} · ${option.price}
                      </option>
                    ))}
                    <option value="custom">Custom tool</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-[#d9e5f2]">Plan</span>
                  <input
                    value={tool.planName}
                    onChange={(event) => updateTool(tool.id, { planName: event.target.value })}
                    className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
                    placeholder="Pro"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-[#d9e5f2]">Seats</span>
                  <input
                    min={1}
                    type="number"
                    value={tool.seats}
                    onChange={(event) => updateTool(tool.id, { seats: Number(event.target.value) || 1 })}
                    className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-[#d9e5f2]">Monthly spend</span>
                  <input
                    min={0}
                    step="0.01"
                    type="number"
                    value={tool.monthlySpend}
                    onChange={(event) => updateTool(tool.id, { monthlySpend: Number(event.target.value) || 0 })}
                    className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
                    placeholder="20"
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm text-[#d9e5f2]">Notes</span>
                <input
                  value={tool.note ?? ""}
                  onChange={(event) => updateTool(tool.id, { note: event.target.value })}
                  className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#6d8198]"
                  placeholder="Used for drafts and reviews"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-[#7bf0c7]/16 bg-[#7bf0c7]/8 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#bdf8e7]">Preview</p>
          <p className="mt-2 text-lg font-semibold text-white">Estimated current spend: ${totalSpend.toFixed(2)}</p>
        </div>
        <button
          type="submit"
          className="focus-ring rounded-full bg-[#7bf0c7] px-5 py-3 text-sm font-semibold text-[#07201a] transition hover:bg-[#94f4d2]"
        >
          Run audit
        </button>
      </div>
    </form>
  );
}