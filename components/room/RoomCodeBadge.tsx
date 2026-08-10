"use client";

import { useState } from "react";

export default function RoomCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 hover:bg-white/10 transition-colors"
    >
      <span className="font-mono text-lg font-bold tracking-widest text-white">
        {code}
      </span>
      <span className="text-xs uppercase tracking-wide text-slate-400">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}