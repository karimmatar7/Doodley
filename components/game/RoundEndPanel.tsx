"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import PlayerListItem from "@/components/room/PlayerListItem";

export default function RoundEndPanel({
  roomId,
  word,
  isHost,
  players,
  hostId,
}: {
  roomId: string;
  word: string | null;
  isHost: boolean;
  players: { id: string; profile_id: string; display_name: string; discriminator: string; score: number }[];
  hostId: string;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleNextRound() {
    setLoading(true);
    await supabase.rpc("start_next_round", { p_room_id: roomId });
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4 text-center">
      <p className="font-hand text-ink">
        The word was:{" "}
        <span className="font-bold text-brand-maroon">{word}</span>
      </p>
      <div className="space-y-2">
        {sorted.map((p) => (
          <PlayerListItem key={p.id} displayName={p.display_name} discriminator={p.discriminator} isHost={p.profile_id === hostId} score={p.score} />
        ))}
      </div>
      {isHost ? (
        <Button onClick={handleNextRound} disabled={loading}>
          {loading ? "Loading..." : "Next round"}
        </Button>
      ) : (
        <p className="text-sm font-hand text-ink-soft">Waiting for the host to continue...</p>
      )}
    </div>
  );
}
