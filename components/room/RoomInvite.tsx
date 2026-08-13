"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type RoomInviteProps = {
  code: string;
  joinUrl: string;
  isHost: boolean;
};

export default function RoomInvite({
  code,
  joinUrl,
  isHost,
}: RoomInviteProps) {
  const [copied, setCopied] = useState(false);

  if (!isHost) {
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Could not copy room code:", error);
    }
  }

  return (
    <section className="sketch-card relative w-full max-w-sm p-4 sm:p-5">
      <div className="tape tape-tl" />
      <p className="label text-center">Invite friends</p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy room code ${code}`}
          className="flex min-w-[132px] flex-col items-center justify-center border-2 border-ink/25 bg-paper-dark px-4 py-3 transition-colors hover:bg-brand-blue-light focus:outline-none"
          style={{ borderRadius: "16px 20px 14px 18px" }}
        >
          <span className="label text-[10px] tracking-[0.16em]">Room code</span>

          <span className="mt-1 text-xl font-bold tracking-[0.2em] text-brand-maroon">
            {code}
          </span>

          <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-soft">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>

        <div className="hidden h-20 w-0.5 bg-ink/15 sm:block" />

        <div className="flex shrink-0 flex-col items-center">
          <div className="border-2 border-ink/20 bg-white p-2.5" style={{ borderRadius: "12px 16px 10px 14px" }}>
            <QRCodeSVG
              value={joinUrl}
              size={128}
              bgColor="#ffffff"
              fgColor="#262220"
              level="M"
              includeMargin
              role="img"
              aria-label={`QR code to join room ${code}`}
              className="block h-32 w-32"
            />
          </div>

          <span className="mt-2 text-center text-[10px] text-ink-soft">
            Scan to join
          </span>
        </div>
      </div>
    </section>
  );
}
