"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Back to lobby" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/lobby")}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      {label}
    </button>
  );
}