import GameEndPanel from "@/components/game/GameEndPanel";
import GameScreen from "@/components/ui/GameScreen";

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
    <GameScreen className="flex items-center justify-center">
      <div className="sketch-card relative w-full max-w-md p-8">
        <div className="tape tape-tl" />
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
            <p className="mt-4 text-center font-hand text-sm text-ink-soft">
              Everyone is ready. Waiting for the host
              to start the game.
            </p>
          )}
      </div>
    </GameScreen>
  );
}
