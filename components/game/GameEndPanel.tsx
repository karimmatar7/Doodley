"use client";

import Button from "@/components/ui/Button";

type GameEndPanelProps = {
  onPlayAgain: () => void | Promise<void>;
  onStartGame?: () => void | Promise<void>;
  onLeave: () => void;
  loading?: boolean;
  waiting?: boolean;
  canStart?: boolean;
};

export default function GameEndPanel({
  onPlayAgain,
  onStartGame,
  onLeave,
  loading = false,
  waiting = false,
  canStart = false,
}: GameEndPanelProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-slate-900/90 p-6 text-center shadow-xl">
      <h2 className="text-2xl font-bold text-white">
        Game over!
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        {waiting
          ? "Waiting for the other players to accept..."
          : "Ready for another game?"}
      </p>

      <div className="mt-6 space-y-3">
        {!waiting && (
          <Button
            type="button"
            onClick={onPlayAgain}
            disabled={loading}
          >
            {loading ? "Joining..." : "Play again"}
          </Button>
        )}

        {canStart && onStartGame && (
          <Button
            type="button"
            onClick={onStartGame}
            disabled={loading}
          >
            {loading ? "Starting..." : "Start game"}
          </Button>
        )}

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