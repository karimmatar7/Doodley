"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

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
        variant="primary"
        fullWidth={false}
        disabled={disabled}
        onClick={() => setConfirmOpen(true)}
        className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
      >
        Leave game
      </Button>

      {confirmOpen && (
        <Modal
          onClose={() => setConfirmOpen(false)}
          ariaLabel="Leave game confirmation"
          className="max-w-sm space-y-4 text-center"
        >
          <p className="font-hand text-sm text-ink">
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
              variant="primary"
              fullWidth={false}
              disabled={leaving}
              onClick={handleConfirm}
              className="shrink-0"
            >
              {leaving ? "Leaving..." : "Leave"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
