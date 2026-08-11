"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type LeaveGameButtonProps = {
  onConfirmLeave: () => void | Promise<void>;
  disabled?: boolean;
};

export default function LeaveGameButton({
  onConfirmLeave,
  disabled,
}: LeaveGameButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function handleConfirm() {
    setLeaving(true);
    await onConfirmLeave();
    setLeaving(false);
    setConfirmOpen(false);
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        fullWidth={false}
        disabled={disabled}
        onClick={() => setConfirmOpen(true)}
        className="shrink-0 whitespace-nowrap !border-brand-maroon/40 !bg-brand-maroon !text-white hover:!bg-brand-maroon-dark px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
      >
        Leave game
      </Button>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Leave game confirmation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
          <div className="w-full max-w-sm space-y-4 rounded-xl border border-white/10 bg-slate-950 p-6 text-center">
            <p className="text-sm text-slate-200">
              Are you sure you want to leave the game?
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                disabled={leaving}
                onClick={() => setConfirmOpen(false)}
                className="shrink-0"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                disabled={leaving}
                onClick={handleConfirm}
                className="shrink-0 !border-brand-maroon/40 !bg-brand-maroon !text-white hover:!bg-brand-maroon-dark"
              >
                {leaving ? "Leaving..." : "Leave"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}