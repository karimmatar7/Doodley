import Link from "next/link";
import PlayerListItem from "@/components/room/PlayerListItem";
import Button from "@/components/ui/Button";

export default function GameEndPanel({
  players,
  hostId,
}: {
  players: { id: string; profile_id: string; display_name: string; discriminator: string; score: number }[];
  hostId: string;
}) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-xl font-bold text-brand-maroon">Final scores</h2>
      <div className="space-y-2">
        {sorted.map((p) => (
          <PlayerListItem key={p.id} displayName={p.display_name} discriminator={p.discriminator} isHost={p.profile_id === hostId} score={p.score} />
        ))}
      </div>
      <Link href="/lobby">
        <Button>Back to lobby</Button>
      </Link>
    </div>
  );
}