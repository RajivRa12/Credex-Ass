"use client";

import { useState } from "react";

interface ShareActionsProps {
  shareUrl: string;
}

export function ShareActions({ shareUrl }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyShareUrl() {
    const absoluteUrl = new URL(shareUrl, window.location.origin).toString();
    await navigator.clipboard.writeText(absoluteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={copyShareUrl}
        className="focus-ring rounded-full bg-[#7bf0c7] px-4 py-3 text-sm font-semibold text-[#07201a] transition hover:bg-[#94f4d2]"
      >
        {copied ? "Copied" : "Copy share link"}
      </button>
      <a
        href="/audit"
        className="focus-ring rounded-full border border-white/12 bg-white/5 px-4 py-3 text-sm font-medium text-[#dce8f5] transition hover:border-white/18 hover:bg-white/10"
      >
        Run another audit
      </a>
    </div>
  );
}