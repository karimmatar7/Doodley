"use client";

import Button from "@/components/ui/Button";

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-900 shadow-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-400">{message}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}