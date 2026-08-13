"use client";

import { useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type QrScannerModalProps = {
  onClose: () => void;
  onScan: (value: string) => void | Promise<void>;
};

export default function QrScannerModal({
  onClose,
  onScan,
}: QrScannerModalProps) {
  const hasScanned = useRef(false);

  function handleScan(
    detectedCodes: Array<{ rawValue: string }>
  ) {
    if (hasScanned.current) {
      return;
    }

    const value = detectedCodes[0]?.rawValue?.trim();

    if (!value) {
      return;
    }

    hasScanned.current = true;
    void onScan(value);
  }

  return (
    <Modal onClose={onClose} className="max-w-sm p-4 sm:p-6">
      <div className="tape tape-tr" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="qr-scanner-title"
            className="text-lg font-bold text-ink"
          >
            Scan room QR code
          </h2>

          <p className="mt-1 font-hand text-sm text-ink-soft">
            Point your camera at the host’s QR code.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close QR scanner"
          className="chip-btn bg-paper-dark px-2 py-0.5 text-xl leading-none text-ink hover:bg-brand-blue-light"
        >
          ×
        </button>
      </div>

      <div className="mt-5 overflow-hidden border-2 border-ink/20 bg-white" style={{ borderRadius: "14px 18px 12px 16px" }}>
        <Scanner
          onScan={handleScan}
          onError={(error) => {
            console.error("QR scanner error:", error);
          }}
          constraints={{
            facingMode: "environment",
          }}
          scanDelay={500}
          styles={{
            container: {
              width: "100%",
            },
            video: {
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
            },
          }}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="mt-5 w-full"
      >
        Cancel
      </Button>
    </Modal>
  );
}
