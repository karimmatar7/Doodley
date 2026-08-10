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
    <section className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg sm:p-5">
      <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        Invite friends
      </p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy room code ${code}`}
          className="flex min-w-[132px] flex-col items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Room code
          </span>

          <span className="mt-1 font-mono text-xl font-bold tracking-[0.2em] text-white">
            {code}
          </span>

          <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>

        <div className="hidden h-20 w-px bg-white/10 sm:block" />

        <div className="flex shrink-0 flex-col items-center">
          <div className="rounded-xl bg-white p-2.5 shadow-md">
            <QRCodeSVG
              value={joinUrl}
              size={128}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="M"
              includeMargin
              role="img"
              aria-label={`QR code to join room ${code}`}
              className="block h-32 w-32"
            />
          </div>

          <span className="mt-2 text-center text-[10px] text-slate-500">
            Scan to join
          </span>
        </div>
      </div>
    </section>
  );
}