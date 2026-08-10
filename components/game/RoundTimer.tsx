"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils/formatTime";

export default function RoundTimer({ endsAt }: { endsAt: string | null }) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!endsAt) return;
    const endsAtTime = new Date(endsAt).getTime();
    function tick() {
      setSecondsLeft(Math.max(0, (endsAtTime - Date.now()) / 1000));
    }
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [endsAt]);

  const isUrgent = secondsLeft <= 10 && secondsLeft > 0;

  return (
    <span className={`font-mono font-bold text-lg ${isUrgent ? "text-brand-maroon animate-pulse-timer" : "text-brand-green"}`}>
      {formatTime(secondsLeft)}
    </span>
  );
}