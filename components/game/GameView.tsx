"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { useRoom } from "@/lib/hooks/useRoom";
import { useRoomPlayers } from "@/lib/hooks/useRoomPlayers";
import { useRound } from "@/lib/hooks/useRound";
import { createClient } from "@/lib/supabase/client";
import DoodleyLogo from "@/components/DoodleyLogo";
import RoomCodeBadge from "@/components/room/RoomCodeBadge";
import DrawingCanvas from "@/components/game/DrawingCanvas";
import RoundTimer from "@/components/game/RoundTimer";
import WordChoicePanel from "@/components/game/WordChoicePanel";
import GuessChat from "@/components/game/GuessChat";
import RoundEndPanel from "@/components/game/RoundEndPanel";
import GameEndPanel from "@/components/game/GameEndPanel";
import PlayerListItem from "@/components/room/PlayerListItem";

export default function GameView({ code }: { code: string }) {
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const { room, loading: roomLoading } = useRoom(code);
  const { players } = useRoomPlayers(room?.id ?? null);
  const { round } = useRound(room?.id ?? null);
  const supabase = createClient();
  const [playAgainLoading, setPlayAgainLoading] = useState(false);
const [playAgainError, setPlayAgainError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileLoading && !profile) router.push("/login");
  }, [profileLoading, profile, router]);

  useEffect(() => {
    if (room && room.status === "lobby") router.push(`/room/${room.code}`);
  }, [room, router]);

  useEffect(() => {
    if (!round || round.status !== "drawing" || !round.ends_at) return;

    const roundId = round.id;
    const endsAt = round.ends_at as string;
    let alreadyCalled = false;

    function checkDeadline() {
      if (alreadyCalled) return;
      const msLeft = new Date(endsAt).getTime() - Date.now();
      if (msLeft <= 0) {
        alreadyCalled = true;
        supabase.rpc("end_round", { p_round_id: roundId }).then(({ error }) => {
          if (error) console.error("end_round failed:", error);
        });
      }
    }

    checkDeadline();
    const interval = setInterval(checkDeadline, 500);
    return () => clearInterval(interval);
  }, [round, supabase]);

  if (profileLoading || roomLoading || !room || !profile) {
    return (
      <main className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading...</p>
      </main>
    );
  }

if (room.status === "game_end") {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8">
        <GameEndPanel
          onPlayAgain={handlePlayAgain}
          onLeave={() => router.push("/lobby")}
          loading={playAgainLoading}
        />

        {playAgainError && (
          <p className="mt-4 text-center text-sm text-red-400">
            {playAgainError}
          </p>
        )}
      </div>
    </main>
  );
}

  if (!round) {
    return (
      <main className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center">
        <p className="text-slate-400 text-sm">Setting up the round...</p>
      </main>
    );
  }

  const myPlayer = players.find((p) => p.profile_id === profile.id);
  const isDrawer = round.drawer_id === myPlayer?.id;
  const isHost = profile.id === room.host_id;
async function handlePlayAgain() {
  if (!room) return;

  setPlayAgainLoading(true);
  setPlayAgainError(null);

  const { error } = await supabase.rpc("play_again", {
    p_room_id: room.id,
  });

  if (error) {
    setPlayAgainError(error.message);
    setPlayAgainLoading(false);
    return;
  }

  router.push(`/room/${room.code}`);
  router.refresh();
}
  return (
    <main className="min-h-screen bg-slate-950 bg-grid px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <DoodleyLogo size="text-2xl" />
          <RoomCodeBadge code={room.code} />
          {round.status === "drawing" && <RoundTimer endsAt={round.ends_at} />}
        </div>

        {round.status === "choosing_word" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            {isDrawer ? (
              <WordChoicePanel roundId={round.id} choices={round.word_choices ?? []} />
            ) : (
              <p className="text-center text-slate-400 text-sm">
                Waiting for the drawer to pick a word...
              </p>
            )}
          </div>
        )}

        {round.status === "drawing" && myPlayer && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <DrawingCanvas roundId={round.id} isDrawer={isDrawer} />
            </div>
            <div className="space-y-3">
              <GuessChat roundId={round.id} playerId={myPlayer.id} isDrawer={isDrawer} players={players} />
              <div className="space-y-1">
                {players
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map((p) => (
                    <PlayerListItem
                      key={p.id}
                      displayName={p.display_name}
                      discriminator={p.discriminator}
                      isHost={p.profile_id === room.host_id}
                      score={p.score}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {round.status === "ended" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 max-w-md mx-auto">
            <RoundEndPanel roomId={room.id} word={round.word} isHost={isHost} players={players} hostId={room.host_id} />
          </div>
        )}
      </div>
    </main>
  );
}