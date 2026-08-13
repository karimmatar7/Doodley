"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Back to lobby" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/lobby")}
      className="chip-btn inline-flex items-center gap-2 bg-paper-light px-4 py-2 text-sm font-bold text-ink hover:bg-paper-dark"
    >
      ← {label}
    </button>
  );
}
