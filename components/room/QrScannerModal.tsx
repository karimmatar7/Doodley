"use client";

import { useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

import Button from "@/components/ui/Button";

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="qr-scanner-title"
              className="text-lg font-semibold text-white"
            >
              Scan room QR code
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Point your camera at the host’s QR code.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close QR scanner"
            className="rounded-lg px-2 py-1 text-xl leading-none text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl bg-black">
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
      </div>
    </div>
  );
}