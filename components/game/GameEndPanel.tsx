"use client";

import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

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
    <div className="w-full space-y-3 text-center">
      <h2 className="text-2xl font-bold text-ink">Game over!</h2>

      <p className="font-hand text-sm text-ink-soft">
        {isHost
          ? allPlayersReady
            ? "Everyone is ready. Start the next game."
            : "Waiting for the other players..."
          : myPlayerReady
            ? "Waiting for the host to start the next game."
            : "Ready for another game?"}
      </p>

      <div className="space-y-3">
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

      <ErrorMessage message={error} />
    </div>
  );
}
