"use client";

import Button from "@/components/ui/Button";

type GameEndPanelProps = {
  isHost: boolean;
  allPlayersReady: boolean;
  myPlayerReady: boolean;
  onPlayAgain: () => void | Promise<void>;
  onStartGame: () => void | Promise<void>;
  onLeave: () => void;
  loading?: boolean;
  error?: string | null;
};

export default function GameEndPanel({
  isHost,
  allPlayersReady,
  myPlayerReady,
  onPlayAgain,
  onStartGame,
  onLeave,
  loading = false,
  error = null,
}: GameEndPanelProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-slate-900/90 p-6 text-center shadow-xl">
      <h2 className="text-2xl font-bold text-white">Game over!</h2>

      <p className="mt-2 text-sm text-slate-400">
        {isHost
          ? allPlayersReady
            ? "Everyone is ready. Start the next game."
            : "Waiting for the other players..."
          : myPlayerReady
            ? "Waiting for the host to start the next game."
            : "Ready for another game?"}
      </p>

      <div className="mt-6 space-y-3">
        {!isHost && !myPlayerReady && (
          <Button
            type="button"
            onClick={onPlayAgain}
            disabled={loading}
          >
            {loading ? "Joining..." : "Play again"}
          </Button>
        )}

        {isHost && allPlayersReady && (
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

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}