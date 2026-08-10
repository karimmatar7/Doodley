import GameEndPanel from "@/components/game/GameEndPanel";

type RematchScreenProps = {
  isHost: boolean;
  allPlayersReady: boolean;
  myPlayerReady: boolean;
  isRematchWaiting: boolean;
  onPlayAgain: () => void | Promise<void>;
  onStartGame: () => void | Promise<void>;
  onLeave: () => void | Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function RematchScreen({
  isHost,
  allPlayersReady,
  myPlayerReady,
  isRematchWaiting,
  onPlayAgain,
  onStartGame,
  onLeave,
  loading,
  error,
}: RematchScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8">
        <GameEndPanel
          isHost={isHost}
          allPlayersReady={allPlayersReady}
          myPlayerReady={myPlayerReady}
          onPlayAgain={onPlayAgain}
          onStartGame={onStartGame}
          onLeave={onLeave}
          loading={loading}
          error={error}
        />

        {allPlayersReady &&
          isRematchWaiting &&
          !isHost && (
            <p className="mt-4 text-center text-sm text-slate-400">
              Everyone is ready. Waiting for the host
              to start the game.
            </p>
          )}
      </div>
    </main>
  );
}