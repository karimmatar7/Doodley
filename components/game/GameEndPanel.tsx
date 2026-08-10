"use client";

import Button from "@/components/ui/Button";

type GameEndPanelProps = {
  onPlayAgain: () => void | Promise<void>;
  onLeave: () => void;
  loading?: boolean;
};

export default function GameEndPanel({
  onPlayAgain,
  onLeave,
  loading = false,
}: GameEndPanelProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-slate-900/90 p-6 text-center shadow-xl">
      <h2 className="text-2xl font-bold text-white">
        Game over!
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Ready for another game?
      </p>

      <div className="mt-6 space-y-3">
        <Button
          type="button"
          onClick={onPlayAgain}
          disabled={loading}
        >
          {loading ? "Starting..." : "Play again"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onLeave}
          disabled={loading}
        >
          Leave game
        </Button>
      </div>
    </div>
  );
}