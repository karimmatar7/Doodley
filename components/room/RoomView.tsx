"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { useRoom } from "@/lib/hooks/useRoom";
import { useRoomPlayers } from "@/lib/hooks/useRoomPlayers";
import { useFriends } from "@/lib/hooks/useFriends";
import { createClient } from "@/lib/supabase/client";
import DoodleyLogo from "@/components/DoodleyLogo";
import RoomCodeBadge from "@/components/room/RoomCodeBadge";
import PlayerListItem from "@/components/room/PlayerListItem";
import Button from "@/components/ui/Button";

export default function RoomView({ code }: { code: string }) {
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const { room, loading: roomLoading, error: roomError } = useRoom(code);
  const { players, loading: playersLoading } = useRoomPlayers(room?.id ?? null);
  const { sendRequest, statusWith } = useFriends(profile?.id ?? null);
  const [starting, setStarting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!profileLoading && !profile) {
      router.push("/login");
    }
  }, [profileLoading, profile, router]);

  useEffect(() => {
    if (room && room.status !== "lobby") {
      router.push(`/game/${room.code}`);
    }
  }, [room, router]);

  async function handleStartGame() {
    if (!room) return;
    setStarting(true);
    await supabase.rpc("start_game", { p_room_id: room.id });
  }

  if (profileLoading || roomLoading) {
    return (
      <main className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading...</p>
      </main>
    );
  }

  if (roomError || !room) {
    return (
      <main className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center">
        <p className="text-brand-maroon text-sm">Room not found.</p>
      </main>
    );
  }

  const isHost = profile?.id === room.host_id;
  const canStart = isHost && players.length >= 2;

  return (
    <main className="relative min-h-screen bg-slate-950 bg-grid flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <DoodleyLogo size="text-4xl sm:text-5xl" />
        </div>

        <div className="flex justify-center">
          <RoomCodeBadge code={room.code} />
        </div>

        <div className="border-t border-white/10 pt-6 space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Players ({players.length})
          </p>
          {playersLoading ? (
            <p className="text-sm text-slate-500">Loading players...</p>
          ) : (
            <div className="space-y-2">
              {players.map((p) => {
                const isMe = p.profile_id === profile?.id;
                return (
                  <PlayerListItem
                    key={p.id}
                    displayName={p.display_name}
                    discriminator={p.discriminator}
                    isHost={p.profile_id === room.host_id}
                    onAdd={isMe ? undefined : () => sendRequest(p.profile_id)}
                    addState={isMe ? "self" : statusWith(p.profile_id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-6">
          {isHost ? (
            <Button onClick={handleStartGame} disabled={!canStart || starting}>
              {starting ? "Starting..." : players.length < 2 ? "Waiting for more players..." : "Start game"}
            </Button>
          ) : (
            <p className="text-sm text-slate-500 text-center">
              Waiting for the host to start the game...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}