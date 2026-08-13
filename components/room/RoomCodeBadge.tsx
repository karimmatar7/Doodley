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
      className="chip-btn flex items-center gap-3 bg-paper-light px-5 py-2.5 hover:bg-brand-blue-light"
    >
      <span className="text-lg font-bold tracking-widest text-brand-maroon">
        {code}
      </span>
      <span className="label text-[10px] tracking-wide">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
