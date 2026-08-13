import DrawingCanvas from "@/components/game/DrawingCanvas";
import GuessChat from "@/components/game/GuessChat";
import PlayerListItem from "@/components/room/PlayerListItem";

type DrawingRoundViewProps = {
  roomId: string;
  roundId: string;
  playerId: string;
  isDrawer: boolean;
  players: Array<{
    id: string;
    display_name: string;
    discriminator: string;
    profile_id: string;
    score: number;
  }>;
  hostId: string;
};

export default function DrawingRoundView({
  roomId,
  roundId,
  playerId,
  isDrawer,
  players,
  hostId,
}: DrawingRoundViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <DrawingCanvas
          roundId={roundId}
          isDrawer={isDrawer}
        />
      </div>

      <div className="space-y-3">
        <GuessChat
          roomId={roomId}
          roundId={roundId}
          playerId={playerId}
          isDrawer={isDrawer}
          players={players}
        />

        <div className="sketch-card space-y-1 p-3">
          {players
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((player) => (
              <PlayerListItem
                key={player.id}
                displayName={player.display_name}
                discriminator={player.discriminator}
                isHost={player.profile_id === hostId}
                score={player.score}
              />
            ))}
        </div>
      </div>
    </div>
  );
}